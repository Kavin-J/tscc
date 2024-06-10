import express, { NextFunction, Request, Response } from 'express';
import { BaseResponse } from './baseResponse';
import { MaybePromise } from './types';
import { HandlerMetadata } from './typed-routes';

export type RequestHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => MaybePromise<BaseResponse> ;
export type MiddlewareHandler =(
  request: Request,
  response: Response,
  next: NextFunction
) => MaybePromise<BaseResponse> | MaybePromise<void> ;

export const catchAsync =
  (fn: (...args: any[]) => any) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => next(error));
  };

export class Router {
  constructor(public readonly instance: express.Router = express.Router()) {}

  private extractHandlers(handlers: RequestHandler[]) {
    const hasMoreOneHandlers = handlers.length - 1 > 1;
    const handler = handlers[handlers.length - 1];
    const middlewares = hasMoreOneHandlers
      ? handlers.slice(0, handlers.length - 1)
      : [];
    return { handler, middlewares };
  }

  private preRequest(handler: RequestHandler) {
    const invokeHandlers = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const result = await handler(req, res, next);
      return res.send({
        success: true,
        message: 'Request successful',
        ...result,
      } satisfies BaseResponse);
    };
    return catchAsync(invokeHandlers);
  }
  get(path: string, ...handlers: RequestHandler[]) {
    const { handler, middlewares } = this.extractHandlers(handlers);

    this.instance.get(path, ...middlewares, this.preRequest(handler));
  }
  post(path: string, ...handlers: RequestHandler[]) {
    const { handler, middlewares } = this.extractHandlers(handlers);

    this.instance.post(path, ...middlewares, this.preRequest(handler));
  }
  put(path: string, ...handlers: RequestHandler[]) {
    const { handler, middlewares } = this.extractHandlers(handlers);

    this.instance.put(path, ...middlewares, this.preRequest(handler));
  }
  delete(path: string, ...handlers: RequestHandler[]) {
    const { handler, middlewares } = this.extractHandlers(handlers);

    this.instance.delete(path, ...middlewares, this.preRequest(handler));
  }
  registerClassRoutes(classInstance: object) {
    const fields = Object.values(classInstance);
    fields.forEach((field) => {
      const route = field as HandlerMetadata;
      if (route.__handlerMetadata) {
        const { path, handler ,middlewares} = route;
        const method = route.method.toLowerCase();
        console.log('Registering route',middlewares, method, path);
        (this.instance.route(path) as any)[method](
          ...middlewares,
          this.preRequest(handler)
        );
      }
    });
    return this;
  }
}
