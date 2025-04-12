​Effective configuration management is crucial for applications operating across various environments, such as development, testing, and production. NestJS offers the @nestjs/config package to streamline the handling of environment variables and configuration settings. ​
NestJS Documentation

Installation

Begin by installing the @nestjs/config package:​

bash
Copy
Edit
npm install --save @nestjs/config
Setting Up the ConfigModule

After installation, import the ConfigModule into your root module (e.g., AppModule) using the forRoot() method:​
NestJS Documentation

typescript
Copy
Edit
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
})
export class AppModule {}
By default, this setup loads environment variables from a .env file located in the project's root directory and merges them with existing process.env variables.​
NestJS Documentation

Customizing Environment File Path

To specify a different path for your .env file, set the envFilePath option:​
NestJS Documentation

typescript
Copy
Edit
ConfigModule.forRoot({
  envFilePath: '.development.env',
});
You can also provide an array of paths, where the first file found takes precedence:​

typescript
Copy
Edit
ConfigModule.forRoot({
  envFilePath: ['.env.development.local', '.env.development'],
});
Ignoring .env Files

If you prefer to use only system environment variables and ignore .env files, set the ignoreEnvFile option to true:​
NestJS Documentation

typescript
Copy
Edit
ConfigModule.forRoot({
  ignoreEnvFile: true,
});
Global Configuration Module

To make the ConfigModule available throughout your application without needing to import it in every module, set the isGlobal option to true:​
NestJS Documentation

typescript
Copy
Edit
ConfigModule.forRoot({
  isGlobal: true,
});
Creating Custom Configuration Files

For complex configurations, you can create custom configuration files that export configuration objects:​
NestJS Documentation

typescript
Copy
Edit
// config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
Load this configuration in the ConfigModule using the load option:​
NestJS Documentation

typescript
Copy
Edit
import configuration from './config/configuration';

ConfigModule.forRoot({
  load: [configuration],
});
Accessing Configuration with ConfigService

Inject the ConfigService into your services or controllers to access configuration variables:​
NestJS Documentation

typescript
Copy
Edit
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getDatabaseHost(): string {
    return this.configService.get<string>('database.host');
  }
}
Validating Configuration

To ensure that all necessary environment variables are set and valid, you can use schema validation with packages like joi:​

bash
Copy
Edit
npm install --save joi
Define a validation schema and pass it to the validationSchema option:​

typescript
Copy
Edit
import * as Joi from 'joi';

ConfigModule.forRoot({
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    PORT: Joi.number().default(3000),
  }),
});
This setup ensures that your environment variables adhere to the specified constraints, throwing an error if validation fails.​

By leveraging the @nestjs/config package, you can manage your application's configuration systematically and securely, adapting seamlessly to different environments. 