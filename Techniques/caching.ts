Caching is a powerful technique to enhance the performance of your NestJS application by temporarily storing frequently accessed data, reducing the need to repeatedly fetch or compute the same information. ​
NestJS Documentation

Installation

To implement caching in NestJS, install the @nestjs/cache-manager and cache-manager packages:​
NestJS Documentation

bash
Copy
Edit
npm install @nestjs/cache-manager cache-manager
Setting Up In-Memory Cache

By default, cache-manager stores data in memory. To enable this, import the CacheModule and configure it using the register() method:​
NestJS Documentation

typescript
Copy
Edit
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
})
export class AppModule {}
Interacting with the Cache Store

To interact with the cache, inject the cache manager instance using the CACHE_MANAGER token:​
NestJS Documentation

typescript
Copy
Edit
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getFromCache(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  async setCache(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async removeFromCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async clearCache(): Promise<void> {
    await this.cacheManager.reset();
  }
}
Auto-Caching Responses

NestJS provides the CacheInterceptor to automatically cache responses. Apply it at the controller or route handler level:​

typescript
Copy
Edit
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('cats')
@UseInterceptors(CacheInterceptor)
export class CatsController {
  @Get()
  findAll(): string[] {
    return ['cat1', 'cat2'];
  }
}
To enable auto-caching globally, bind the CacheInterceptor in the providers array:​
NestJS Documentation

typescript
Copy
Edit
import { Module } from '@nestjs/common';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [CacheModule.register()],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
Setting Time-to-Live (TTL)

Specify a default TTL for cached items during CacheModule registration:​
NestJS Documentation

typescript
Copy
Edit
CacheModule.register({
  ttl: 5, // seconds
});
To override the global TTL for specific methods, use the @CacheTTL() decorator:​
NestJS Documentation

typescript
Copy
Edit
import { CacheTTL } from '@nestjs/cache-manager';

@Controller('cats')
export class CatsController {
  @Get()
  @CacheTTL(10) // seconds
  findAll(): string[] {
    return ['cat1', 'cat2'];
  }
}
Using Alternative Cache Stores

cache-manager supports various storage solutions like Redis. To use Redis, install the @keyv/redis package:​
NestJS Documentation

bash
Copy
Edit
npm install @keyv/redis
Then, configure the CacheModule to use Redis:​

typescript
Copy
Edit
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { Keyv } from 'keyv';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: new Keyv({ store: createKeyv('redis://localhost:6379') }),
      }),
    }),
  ],
})
export class AppModule {}
By integrating caching into your NestJS application, you can significantly improve response times and overall efficiency. ​