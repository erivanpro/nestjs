// Import necessary modules from NestJS
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// Bootstrap function to start the NestJS application
async function bootstrap() {
  // Create an application instance using NestFactory
  const app = await NestFactory.create(AppModule);
  // Listen on the specified port, defaulting to 3000 if not set in the environment variables
  await app.listen(process.env.PORT ?? 3000);
}
// Execute the bootstrap function to start the application
bootstrap();
/*
  Setup Instructions:
  1. Ensure Node.js (version >= 20) is installed on your OS.
  2. Install the NestJS CLI globally:
     $ npm i -g @nestjs/cli
  3. Create a new NestJS project:
     $ nest new project-name
  4. Navigate to the project directory and install dependencies.
  5. Start the application:
     $ npm run start

  Development Tips:
  - Use `npm run start:dev` to enable live reload while coding.
  - Use `npm run lint` to check for linting issues.
  - Use `npm run format` to format code with Prettier.

  Platforms:
  - Default: Express (via @nestjs/platform-express)
  - Alternative: Fastify (for high performance needs)

  Error Handling:
  - By default, errors during app creation will cause an exit (code 1).
  - To override this behavior, use: `NestFactory.create(AppModule, { abortOnError: false })`
*/
