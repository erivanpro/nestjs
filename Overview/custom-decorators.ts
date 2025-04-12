Certainly! Below is a consolidated TypeScript file demonstrating various examples of creating and using custom decorators in NestJS, each accompanied by explanatory comments. These examples are based on the official NestJS documentation.

typescript
Copy
Edit
import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
  Controller,
  Get,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

// Custom parameter decorator to extract the 'user' object from the request
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // Assumes 'user' has been attached to the request object
  },
);

// Usage in a controller method
@Controller('users')
export class UsersController {
  @Get('profile')
  getProfile(@User() user: any) {
    console.log(user); // Logs the user object
    return user;
  }
}

// Custom parameter decorator to extract specific properties from the 'user' object
export const UserProperty = createParamDecorator(
  (property: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return property ? user?.[property] : user;
  },
);

// Usage in a controller method
@Controller('users')
export class UsersController {
  @Get('first-name')
  getFirstName(@UserProperty('firstName') firstName: string) {
    console.log(`Hello ${firstName}`); // Logs 'Hello' followed by the user's first name
    return `Hello ${firstName}`;
  }
}

// Composite decorator combining multiple decorators related to authentication
export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata('roles', roles), // Assigns roles metadata
    UseGuards(AuthGuard, RolesGuard), // Applies authentication and roles guards
    ApiBearerAuth(), // Adds bearer authentication to Swagger documentation
    ApiUnauthorizedResponse({ description: 'Unauthorized' }), // Adds unauthorized response to Swagger documentation
  );
}

// Usage in a controller method
@Controller('admin')
export class AdminController {
  @Get('dashboard')
  @Auth('admin') // Applies the composite Auth decorator with 'admin' role
  getDashboard() {
    return 'Admin Dashboard';
  }
}
Explanation:

Custom Parameter Decorator (User):

Extracts the user object from the request.​
NestJS Documentation

Can be used in controller methods to access the authenticated user directly.​

Custom Parameter Decorator with Property Extraction (UserProperty):

Extracts a specific property from the user object based on the provided argument.​
NestJS Documentation

Allows for concise access to user properties in controller methods.​

Composite Decorator (Auth):

Combines multiple decorators related to authentication and authorization.​

Sets roles metadata, applies guards, and adds Swagger documentation decorators.​
NestJS Documentation

Simplifies the application of multiple decorators with a single @Auth() decorator.​
NestJS Documentation

These examples illustrate how to create and utilize custom decorators in NestJS to enhance the readability and maintainability of your code by encapsulating common patterns and functionalities.