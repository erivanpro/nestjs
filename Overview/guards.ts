Certainly! Below is a comprehensive TypeScript file that consolidates various examples of NestJS guards, each accompanied by explanatory comments. This compilation is based on the official NestJS documentation.

typescript
Copy
Edit
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

// Define a custom decorator for specifying roles
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// Basic AuthGuard that validates requests
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // Implement your validation logic here
    return validateRequest(request);
  }
}

// Function to validate the request (placeholder implementation)
function validateRequest(request: Request): boolean {
  // Add your authentication logic here
  return true; // Return true if the request is valid, otherwise false
}

// RolesGuard for role-based authorization
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

// Controller demonstrating the use of guards and role-based access control
@Controller('cats')
@UseGuards(AuthGuard) // Apply AuthGuard to all routes in this controller
export class CatsController {
  @Post()
  @Roles('admin') // Restrict this route to users with the 'admin' role
  @UseGuards(RolesGuard) // Apply RolesGuard to this specific route
  create() {
    return 'This action adds a new cat';
  }

  @Get()
  findAll() {
    return 'This action returns all cats';
  }
}
Explanation:

Custom Roles Decorator:

The Roles decorator is defined using NestJS's SetMetadata function. It assigns metadata to route handlers, specifying the roles required to access them.​
NestJS Documentation

AuthGuard:

This guard implements the CanActivate interface and contains the canActivate method, which determines whether a request should proceed.​
NestJS Documentation

The validateRequest function is a placeholder where you can implement your authentication logic, such as validating JWT tokens or API keys.​

RolesGuard:

This guard also implements the CanActivate interface and uses the Reflector service to access the metadata set by the Roles decorator.​
NestJS Documentation

It checks if the user making the request has the required roles to access the route.​
NestJS Documentation

CatsController:

The @UseGuards(AuthGuard) decorator applies the AuthGuard to all routes within the CatsController.​
NestJS Documentation

The create method has additional guards:​

The @Roles('admin') decorator specifies that only users with the 'admin' role can access this route.

The @UseGuards(RolesGuard) decorator applies the RolesGuard to enforce role-based access control.

This setup ensures that authentication and authorization are handled systematically, allowing for scalable and maintainable access control in your NestJS application.