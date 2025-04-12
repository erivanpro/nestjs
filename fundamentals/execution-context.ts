​In NestJS, the execution context provides methods to access details about the current request's context, facilitating the creation of reusable guards, filters, and interceptors across various application types, such as HTTP servers, microservices, and WebSockets. 
NestJS Documentation

ArgumentsHost Class

The ArgumentsHost class allows retrieval of handler arguments, enabling adaptation to the appropriate context (e.g., HTTP, RPC, or WebSockets). For instance, in an HTTP application using Express, the host object encapsulates the [request, response, next] array. 
NestJS Documentation

To determine the current application context, use the getType() method:

typescript
Copy
Edit
if (host.getType() === 'http') {
  // Handle HTTP-specific logic
} else if (host.getType() === 'rpc') {
  // Handle RPC-specific logic
} else if (host.getType() === 'ws') {
  // Handle WebSockets-specific logic
}
To access specific arguments, utilize the getArgs() or getArgByIndex() methods:​
NestJS Documentation

typescript
Copy
Edit
const [req, res, next] = host.getArgs();
const request = host.getArgByIndex(0);
For context-specific objects, switch to the appropriate context:​

typescript
Copy
Edit
const ctx = host.switchToHttp();
const request = ctx.getRequest();
const response = ctx.getResponse();
ExecutionContext Class

Extending ArgumentsHost, the ExecutionContext class offers additional methods to access the controller class and handler method involved in the current request:​
NestJS Documentation

typescript
Copy
Edit
const className = context.getClass().name; // e.g., 'CatsController'
const handlerName = context.getHandler().name; // e.g., 'create'
These methods are particularly useful for accessing metadata set through decorators like @SetMetadata(), enhancing the flexibility of guards and interceptors. 
NestJS Documentation

Reflection and Metadata

NestJS allows attaching custom metadata to route handlers using decorators such as @SetMetadata(). To access this metadata within guards or interceptors, inject the Reflector class:​
NestJS Documentation

typescript
Copy
Edit
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // Authorization logic
  }
}
This approach enables the development of flexible and reusable components that adapt to various application contexts within NestJS.​




