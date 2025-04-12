​In NestJS, the lifecycle events provide hooks that allow developers to tap into the various stages of an application's lifecycle, from initialization to termination. These hooks enable the execution of custom logic at specific points, facilitating tasks such as resource management, event handling, and graceful shutdown procedures. ​
NestJS Documentation

Lifecycle Sequence

The application lifecycle is divided into three main phases:​

Initializing: Modules and providers are instantiated and dependencies are resolved.​

Running: The application is actively handling requests.​

Terminating: The application is shutting down, and resources are being released.​

Lifecycle Hooks

NestJS provides several lifecycle hooks that can be implemented in modules, providers, or controllers:​
NestJS Documentation

onModuleInit(): Called once the host module's dependencies have been resolved.​
NestJS Documentation

typescript
Copy
Edit
  import { Injectable, OnModuleInit } from '@nestjs/common';

  @Injectable()
  export class AppService implements OnModuleInit {
    onModuleInit() {
      console.log('Module has been initialized.');
    }
  }
onApplicationBootstrap(): Invoked after all modules have been initialized, but before the application starts listening for connections.​
NestJS Documentation

typescript
Copy
Edit
  import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

  @Injectable()
  export class AppService implements OnApplicationBootstrap {
    onApplicationBootstrap() {
      console.log('Application is bootstrapping.');
    }
  }
onModuleDestroy(): Called after a termination signal (e.g., SIGTERM) has been received.​
NestJS Documentation

typescript
Copy
Edit
  import { Injectable, OnModuleDestroy } from '@nestjs/common';

  @Injectable()
  export class AppService implements OnModuleDestroy {
    onModuleDestroy() {
      console.log('Module is being destroyed.');
    }
  }
beforeApplicationShutdown(): Invoked after all onModuleDestroy() handlers have completed; once complete, all existing connections will be closed.​
NestJS Documentation

typescript
Copy
Edit
  import { Injectable, BeforeApplicationShutdown } from '@nestjs/common';

  @Injectable()
  export class AppService implements BeforeApplicationShutdown {
    beforeApplicationShutdown() {
      console.log('Application is about to shut down.');
    }
  }
onApplicationShutdown(): Called after connections close.​
NestJS Documentation

typescript
Copy
Edit
  import { Injectable, OnApplicationShutdown } from '@nestjs/common';

  @Injectable()
  export class AppService implements OnApplicationShutdown {
    onApplicationShutdown() {
      console.log('Application has shut down.');
    }
  }
Asynchronous Initialization

Both onModuleInit() and onApplicationBootstrap() hooks can handle asynchronous operations by returning a Promise or using the async keyword:​
NestJS Documentation

typescript
Copy
Edit
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    await this.asyncInitialization();
  }

  private async asyncInitialization() {
    // Perform async tasks
  }
}
Application Shutdown

To handle application shutdown events triggered by system signals (like SIGTERM), you must enable shutdown hooks:​
NestJS Documentation

typescript
Copy
Edit
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
By implementing these lifecycle hooks, you can manage resources effectively, handle events appropriately, and ensure that your NestJS application initializes and terminates gracefully. 