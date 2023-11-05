import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Express } from 'express';

export const GetUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: Express.Request = context.switchToHttp().getRequest();
    return request.user;
  },
);
