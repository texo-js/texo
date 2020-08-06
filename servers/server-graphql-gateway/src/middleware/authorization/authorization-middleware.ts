import { Middleware } from 'koa';
import { Logger } from '@texo/logging';

export interface AuthorizationMiddleware {
  authorize(logger: Logger): Middleware;
}