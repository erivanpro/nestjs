The NestJS ModuleRef class provides advanced capabilities for managing and accessing providers within your application's dependency injection system. Below is an overview of its functionalities, accompanied by code examples:​
NestJS Documentation

1. Injecting ModuleRef into a Service

To utilize ModuleRef, inject it into your service as shown:​

typescript
Copy
Edit
import { Injectable, ModuleRef } from '@nestjs/core';

@Injectable()
export class CatsService {
  constructor(private moduleRef: ModuleRef) {}
}
2. Retrieving Instances with get()

The get() method fetches an existing instance of a provider by its injection token. By default, it searches within the current module. To access a provider from the global context, set the strict option to false:​
NestJS Documentation

typescript
Copy
Edit
const service = this.moduleRef.get(Service, { strict: false });
3. Resolving Scoped Providers with resolve()

For transient or request-scoped providers, use the asynchronous resolve() method to obtain a new instance:​
NestJS Documentation

typescript
Copy
Edit
import { Injectable, OnModuleInit, ModuleRef } from '@nestjs/core';

@Injectable()
export class CatsService implements OnModuleInit {
  private transientService: TransientService;

  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.transientService = await this.moduleRef.resolve(TransientService);
  }
}
To ensure multiple resolve() calls share the same instance, generate a context identifier using ContextIdFactory:​
NestJS Documentation

typescript
Copy
Edit
import { Injectable, OnModuleInit, ModuleRef, ContextIdFactory } from '@nestjs/core';

@Injectable()
export class CatsService implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    const contextId = ContextIdFactory.create();
    const transientServices = await Promise.all([
      this.moduleRef.resolve(TransientService, contextId),
      this.moduleRef.resolve(TransientService, contextId),
    ]);
    console.log(transientServices[0] === transientServices[1]); // true
  }
}
4. Registering a Custom REQUEST Provider

When manually creating a context identifier, associate a custom REQUEST object with it:​
NestJS Documentation

typescript
Copy
Edit
const contextId = ContextIdFactory.create();
this.moduleRef.registerRequestByContextId(requestObject, contextId);
5. Obtaining the Current Context Identifier

To resolve a request-scoped provider within its request context, retrieve the current context identifier:​
NestJS Documentation

typescript
Copy
Edit
import { Injectable, Inject, REQUEST, ContextIdFactory, ModuleRef } from '@nestjs/core';

@Injectable()
export class CatsService {
  constructor(
    @Inject(REQUEST) private request: Record<string, unknown>,
    private moduleRef: ModuleRef,
  ) {}

  async someMethod() {
    const contextId = ContextIdFactory.getByRequest(this.request);
    const catsRepository = await this.moduleRef.resolve(CatsRepository, contextId);
  }
}
6. Dynamically Instantiating Classes with create()

To instantiate classes not registered as providers:​
NestJS Documentation

typescript
Copy
Edit
import { Injectable, OnModuleInit, ModuleRef } from '@nestjs/core';

@Injectable()
export class CatsService implements OnModuleInit {
  private catsFactory: CatsFactory;

  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.catsFactory = await this.moduleRef.create(CatsFactory);
  }
}
These examples demonstrate the flexibility and power of the ModuleRef class in managing providers and dependencies within a NestJS application.​
NestJS Documentation