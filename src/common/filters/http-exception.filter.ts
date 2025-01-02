import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiResponse } from '../interfaces/response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';
    let validationErrors = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;

      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object') {
        validationErrors = exceptionResponse;
      }
    }

    const errorResponse: ApiResponse<null> = {
      statusCode: status,
      message,
      data: null,
      errors: validationErrors,
    };

    response.status(status).json(errorResponse);
  }
}

// @Catch()
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse();
//     const request = ctx.getRequest();

//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let message = 'An unexpected error occurred';

//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       message = exception.message;
//     }

//     const errorResponse: ApiResponse<null> = {
//       statusCode: status,
//       message,
//       data: null,
//     };

//     response.status(status).json(errorResponse);
//   }
// }
