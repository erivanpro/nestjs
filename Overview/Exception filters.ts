Certainly! Below is a comprehensive example demonstrating the implementation and usage of exception filters in a NestJS application, with detailed comments for clarity:

typescript
Copy
Edit
// Import necessary decorators and interfaces from NestJS and Express
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
  Controller,
  Get,
  Post,
  Body,
  UseFilters,
  Param,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Custom exception filter to handle all HTTP exceptions
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // Switch context to HTTP to access request and response objects
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Retrieve the status code of the exception or default to INTERNAL_SERVER_ERROR
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Send a custom JSON response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

// Custom middleware that logs incoming requests
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    next(); // Proceed to the next middleware or route handler
  }
}

// Data Transfer Object (DTO) for creating a cat
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}

// Custom exception for forbidden actions
export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}

// Controller handling routes related to cats
@Controller('cats')
export class CatsController {
  // POST /cats
  @Post()
  @UseFilters(new HttpExceptionFilter()) // Apply exception filter to this route
  async create(@Body() createCatDto: CreateCatDto) {
    throw new ForbiddenException(); // Simulate a forbidden action
  }

  // GET /cats
  @Get()
  async findAll() {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN); // Throw an HTTP exception
  }

  // GET /cats/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Simulate finding a cat by ID
    if (id !== '1') {
      throw new HttpException('Cat not found', HttpStatus.NOT_FOUND);
    }
    return { id, name: 'Tom', age: 3, breed: 'Tabby' };
  }
}

// Module that imports the CatsController and applies middleware
@Module({
  controllers: [CatsController],
})
export class CatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // Applying class-based middleware
      .forRoutes(CatsController); // For all routes in CatsController
  }
}

// Root application module
@Module({
  imports: [CatsModule], // Importing the CatsModule
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // Applying middleware globally
      .forRoutes('*'); // For all routes
  }
}
Explanation:

Custom Exception Filter (HttpExceptionFilter):

The @Catch(HttpException) decorator binds the filter to handle exceptions of type HttpException.​
NestJS Documentation

The catch method accesses the HTTP context to retrieve the request and response objects.​

It determines the HTTP status code of the exception and sends a custom JSON response containing the status code, timestamp, and request path.​
NestJS Documentation

Custom Middleware (LoggerMiddleware):

Logs the HTTP method and URL of incoming requests.​

Calls next() to pass control to the next middleware or route handler.​

Data Transfer Object (CreateCatDto):

Defines the structure for creating a new cat with name, age, and breed properties.​

Custom Exception (ForbiddenException):

Extends the HttpException class to create a custom exception with a status code of 403 (Forbidden).​

CatsController:

Handles routes related to cats.​

The create method applies the HttpExceptionFilter using the @UseFilters decorator and throws a ForbiddenException.​
NestJS Documentation

The findAll method demonstrates throwing a generic HttpException.​

The findOne method simulates retrieving a cat by ID and throws a NotFoundException if the cat is not found.​

CatsModule:

Imports CatsController.​

Applies the LoggerMiddleware to all routes in CatsController using the configure method.​

AppModule:

Imports CatsModule.​

Demonstrates how to apply LoggerMiddleware globally to all routes using the forRoutes('*') method.​

This example illustrates the implementation of custom exception filters, middleware, and controllers in a NestJS application, providing a clear understanding of how to handle exceptions and log incoming requests effectively.