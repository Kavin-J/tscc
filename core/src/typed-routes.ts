import { Request, Response } from 'express';
import z from 'zod';
import { MaybePromise } from '@tscc/core';
import { BaseResponse } from './baseResponse';
import { ValidationError } from './errors';
import { fromZodError } from 'zod-validation-error';
import { MiddlewareHandler, RequestHandler } from '@tscc/core';

export class TypedRoutes {
  get(path: string) {
    return new TypedRouteHandler(path, 'get');
  }
  post(path: string) {
    return new TypedRouteHandler(path, 'post');
  }
  put(path: string) {
    return new TypedRouteHandler(path, 'put');
  }
  delete(path: string) {
    return new TypedRouteHandler(path, 'delete');
  }
}
export interface HandlerMetadata {
  __handlerMetadata: true;
  method: string;
  path: string;
  handler: RequestHandler;
  middlewares: MiddlewareHandler[];
}

export type TypedHandler<
  TQuery extends z.ZodTypeAny,
  TParams extends z.ZodTypeAny,
  TBody extends z.ZodTypeAny,
  TResponse extends BaseResponse = BaseResponse
> = (context: {
  query: z.infer<TQuery>;
  params: z.infer<TParams>;
  body: z.infer<TBody>;
  req: Request<z.infer<TParams>, any, z.infer<TBody>, z.infer<TQuery>>;
  res: Response<TResponse>;
}) => MaybePromise<TResponse>;

export class TypedRouteHandler<
  RouteQuery extends z.ZodTypeAny,
  RouteParams extends z.ZodTypeAny,
  RouteBody extends z.ZodTypeAny
> {
  schema: {
    query?: z.ZodTypeAny;
    body?: z.ZodTypeAny;
    params?: z.ZodTypeAny;
  } = {};

  private middlewares: MiddlewareHandler[] = [];

  constructor(private readonly path: string, private readonly method: string) {}

  query<Query extends z.ZodTypeAny>(schema: Query) {
    this.schema.query = schema;
    return this as unknown as TypedRouteHandler<Query, RouteParams, RouteBody>;
  }

  params<Params extends z.ZodTypeAny>(schema: Params) {
    this.schema.params = schema;
    return this as unknown as TypedRouteHandler<RouteQuery, Params, RouteBody>;
  }

  body<Body extends z.ZodTypeAny>(schema: Body) {
    this.schema.body = schema;
    return this as unknown as TypedRouteHandler<RouteQuery, RouteParams, Body>;
  }
  use(...middleware: MiddlewareHandler[]) {
    this.middlewares.push(...middleware);
    return this;
  }

  handler(
    handler: TypedHandler<RouteQuery, RouteParams, RouteBody>
  ): HandlerMetadata {
    const invokeHandler = async (req: Request, res: Response) => {
      let message = '';
      let query;
      let params;
      let body;
      try {
        message = 'Query';
        query = this.schema.query
          ? this.schema.query.parse(req.query)
          : undefined;
        message = 'Params';
        params = this.schema.params
          ? this.schema.params.parse(req.params)
          : undefined;
        message = 'Body';
        body = this.schema.body ? this.schema.body.parse(req.body) : undefined;
      } catch (error: unknown) {
        if (error instanceof z.ZodError) {
          const validationError = fromZodError(error);
          throw new ValidationError(`${message} ${validationError.toString()}`);
        }
      }
      return handler({ query, params, body, req, res });
    };
    return {
      method: this.method,
      path: this.path,
      handler: invokeHandler,
      __handlerMetadata: true,
      middlewares: this.middlewares,
    };
  }
}
