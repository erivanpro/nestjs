n NestJS, modules are eagerly loaded by default, meaning all modules are initialized when the application starts, regardless of immediate necessity. This behavior can lead to increased startup times, particularly in serverless environments where minimizing cold start latency is crucial. To address this, NestJS offers lazy loading, allowing modules to be loaded on-demand, thereby optimizing application performance. ​
NestJS Documentation

Implementing Lazy Loading with LazyModuleLoader

NestJS provides the LazyModuleLoader class to facilitate lazy loading. This class can be injected into services or other providers to dynamically load modules when needed. Here's how to implement it:​

Inject LazyModuleLoader into a Service:

First, inject the LazyModuleLoader into your service:

typescript
Copy
Edit
import { Injectable } from '@nestjs/common';
import { LazyModuleLoader } from '@nestjs/core';

@Injectable()
export class CatsService {
  constructor(private lazyModuleLoader: LazyModuleLoader) {}
}
Load a Module Dynamically:

To load a module dynamically, use the load method provided by LazyModuleLoader:

typescript
Copy
Edit
import { Injectable } from '@nestjs/common';
import { LazyModuleLoader } from '@nestjs/core';

@Injectable()
export class CatsService {
  constructor(private lazyModuleLoader: LazyModuleLoader) {}

  async loadLazyModule() {
    const { LazyModule } = await import('./lazy.module');
    const moduleRef = await this.lazyModuleLoader.load(() => LazyModule);
    // Use moduleRef as needed
  }
}
In this example, LazyModule is imported dynamically, and lazyModuleLoader.load is used to load the module. The moduleRef obtained allows access to the providers within the loaded module.

Accessing Providers from a Lazy-Loaded Module

Once a module is loaded, you can access its providers using the get method of the moduleRef:​

typescript
Copy
Edit
const lazyService = moduleRef.get(LazyService);
This approach enables interaction with services or providers defined in the dynamically loaded module. ​
NestJS Documentation

Considerations and Limitations

While lazy loading offers performance benefits, there are important considerations:

Controllers, Resolvers, and Gateways: Lazy loading is not suitable for controllers, GraphQL resolvers, or gateways, as they define application routes and cannot be registered dynamically at runtime. ​
NestJS Documentation

Lifecycle Hooks: Lifecycle hooks are not invoked in lazy-loaded modules and services. ​
NestJS Documentation

Global Modules: Lazy-loaded modules cannot be registered as global modules, as they are initialized on-demand after the application has already bootstrapped. ​
NestJS Documentation

Common Use Cases

Lazy loading is particularly beneficial in scenarios such as:​

Serverless Functions: Reducing cold start times by loading only necessary modules per function invocation.​
NestJS Documentation

Microservices: Loading specific modules based on incoming requests or events to optimize resource utilization.​

Feature Modules: Deferring the loading of feature modules until they are required, improving initial load times of the application.​

By strategically implementing lazy loading, you can enhance the efficiency and responsiveness of your NestJS applications.