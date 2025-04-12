​In NestJS, the DiscoveryService is a utility provided by the @nestjs/core package that enables dynamic inspection and retrieval of providers, controllers, and their associated metadata within an application. This capability is particularly beneficial when developing plugins, decorators, or advanced features that depend on runtime introspection. ​
NestJS Documentation

Getting Started with DiscoveryService

To utilize the DiscoveryService, you must first import the DiscoveryModule into the module where you plan to use it:​
NestJS Documentation

typescript
Copy
Edit
import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ExampleService } from './example.service';

@Module({
  imports: [DiscoveryModule],
  providers: [ExampleService],
})
export class ExampleModule {}
After setting up the module, you can inject the DiscoveryService into any provider or service where dynamic discovery is required:​
NestJS Documentation

typescript
Copy
Edit
import { Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

@Injectable()
export class ExampleService {
  constructor(private readonly discoveryService: DiscoveryService) {}
}
Discovering Providers and Controllers

The DiscoveryService allows you to retrieve all registered providers and controllers within your application. This is useful for scenarios where you need to process these components dynamically.​
NestJS Documentation

To access all providers:​

typescript
Copy
Edit
const providers = this.discoveryService.getProviders();
console.log(providers);
Similarly, to retrieve all controllers:​

typescript
Copy
Edit
const controllers = this.discoveryService.getControllers();
console.log(controllers);
Each retrieved object contains information such as its instance, token, and metadata, enabling detailed introspection and manipulation.​
NestJS Documentation

Extracting Metadata

Beyond discovering providers and controllers, the DiscoveryService facilitates the retrieval of metadata attached to these components. This is particularly valuable when working with custom decorators that store metadata at runtime.​
NestJS Documentation

For example, consider a custom decorator created using the DiscoveryService's createDecorator method:​

typescript
Copy
Edit
import { DiscoveryService } from '@nestjs/core';

export const FeatureFlag = DiscoveryService.createDecorator();
Applying this decorator to a service allows you to tag it with specific metadata:​
NestJS Documentation

typescript
Copy
Edit
import { Injectable } from '@nestjs/common';
import { FeatureFlag } from './custom-metadata.decorator';

@Injectable()
@FeatureFlag('experimental')
export class CustomService {}
You can then use the DiscoveryService to filter and retrieve providers based on this metadata:​

typescript
Copy
Edit
const providers = this.discoveryService.getProviders();
const experimentalProviders = providers.filter(
  (provider) =>
    this.discoveryService.getMetadataByDecorator(FeatureFlag, provider) ===
    'experimental',
);
console.log('Providers with the "experimental" feature flag metadata:', experimentalProviders);
This approach enables dynamic processing and organization of providers based on custom metadata, enhancing the flexibility and modularity of your application.​
NestJS Documentation

Conclusion

The DiscoveryService in NestJS is a powerful tool for runtime introspection, allowing developers to dynamically inspect and retrieve providers, controllers, and their metadata. By leveraging this service, you can build more flexible, modular, and dynamic applications, facilitating advanced features such as automatic registration mechanisms, analytics tracking, and more.