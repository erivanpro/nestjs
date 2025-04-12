​Automated testing is a crucial aspect of software development, ensuring that applications function correctly and maintain high-quality standards. NestJS offers robust support for various testing methodologies, including unit and end-to-end (e2e) testing, integrating seamlessly with tools like Jest and Supertest. ​
NestJS Documentation

Installation

To begin testing in a NestJS application, install the @nestjs/testing package:​

bash
Copy
Edit
npm install --save-dev @nestjs/testing
Unit Testing

Unit tests focus on individual components, such as services or controllers, in isolation. NestJS provides utilities to facilitate unit testing. For example, consider testing a CatsController and its CatsService:​
NestJS Documentation

typescript
Copy
Edit
import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

describe('CatsController', () => {
  let catsController: CatsController;
  let catsService: CatsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [CatsService],
    }).compile();

    catsService = moduleRef.get<CatsService>(CatsService);
    catsController = moduleRef.get<CatsController>(CatsController);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result = ['test'];
      jest.spyOn(catsService, 'findAll').mockImplementation(() => result);

      expect(await catsController.findAll()).toBe(result);
    });
  });
});
In this setup, the Test.createTestingModule method creates a testing module that mimics the real module, allowing for isolated testing of the CatsController. ​
NestJS Documentation

End-to-End (E2E) Testing

E2E tests assess the application’s behavior by simulating real user scenarios. NestJS, in conjunction with Supertest, facilitates E2E testing. For instance:​

typescript
Copy
Edit
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { CatsModule } from '../../src/cats/cats.module';
import { CatsService } from '../../src/cats/cats.service';
import { INestApplication } from '@nestjs/common';

describe('Cats', () => {
  let app: INestApplication;
  let catsService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [CatsModule],
    })
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/GET cats', () => {
    return request(app.getHttpServer())
      .get('/cats')
      .expect(200)
      .expect({
        data: catsService.findAll(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
This test initializes the application and uses Supertest to perform HTTP requests, verifying that the /cats endpoint returns the expected response. ​
NestJS Documentation

Overriding Providers

In testing scenarios, it's often necessary to replace real providers with mock implementations. NestJS's testing utilities allow for such overrides:​
NestJS Documentation

typescript
Copy
Edit
const moduleRef: TestingModule = await Test.createTestingModule({
  imports: [AppModule],
})
  .overrideProvider(CatsService)
  .useValue(mockCatsService)
  .compile();
Here, mockCatsService is a mocked version of CatsService, enabling tests to run without relying on the actual service implementation. ​
NestJS Documentation

By leveraging these testing strategies and utilities, NestJS developers can ensure their applications are reliable, maintainable, and performant.