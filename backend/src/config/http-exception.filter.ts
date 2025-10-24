import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (exception instanceof ThrottlerException) {
      return response.status(status).json({
        statusCode: status,
        message: 'Too many requests. Please try again later.',
        path: request.url,
      });
    }

    response.status(status).json({
      statusCode: status,
      message: exception?.message || 'Something went wrong.',
      path: request.url,
    });
  }
}
