​Validating incoming data is a critical aspect of building robust and secure applications. NestJS simplifies this process through the use of pipes, particularly the ValidationPipe, which leverages the class-validator and class-transformer packages to enforce and manage validation rules.​
NestJS Documentation

Installation

To begin, install the necessary packages:​

bash
Copy
Edit
npm install --save class-validator class-transformer
Setting Up ValidationPipe

NestJS provides the ValidationPipe to automatically validate incoming requests. This pipe can be applied at various levels: globally, at the controller level, or at the route handler level.​
NestJS Documentation

Global Application Level:

typescript
Copy
Edit
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
Controller or Route Handler Level:

typescript
Copy
Edit
import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createCatDto: CreateCatDto) {
    // Handle the creation logic
  }
}
Creating Data Transfer Objects (DTOs) with Validation Rules

Define DTOs using class-validator decorators to specify validation rules:​
NestJS Documentation

typescript
Copy
Edit
import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  @Max(20)
  age: number;

  @IsString()
  breed: string;
}
In this example, CreateCatDto ensures that name and breed are strings, and age is an integer between 1 and 20.​

Stripping Unwanted Properties

To automatically remove properties that are not explicitly defined in the DTO, enable the whitelist option:​
NestJS Documentation

typescript
Copy
Edit
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
  }),
);
This configuration ensures that any extra properties sent by clients are stripped from the payload, preventing unintended data from being processed.​

Handling Non-Whitelisted Properties

To reject requests containing non-whitelisted properties and return an error response, set the forbidNonWhitelisted option:​
NestJS Documentation

typescript
Copy
Edit
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
With this setting, the application will respond with a 400 Bad Request status if extra properties are present in the incoming data.​

Transforming Payloads to DTO Instances

By default, incoming data is plain JavaScript objects. To transform these payloads into instances of the DTO classes, enable the transform option:​
NestJS Documentation

typescript
Copy
Edit
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
  }),
);
This transformation allows for the use of class methods and ensures that the types are correctly assigned.​

Explicitly Transforming Primitive Types

For scenarios where you need to convert query or route parameters to specific types, NestJS provides built-in pipes like ParseIntPipe:​
NestJS Documentation

typescript
Copy
Edit
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    // 'id' is now guaranteed to be a number
  }
}
This ensures that the id parameter is parsed as an integer before it reaches the route handler.​

Disabling Detailed Error Messages

In production environments, you might want to disable detailed error messages for security reasons. This can be achieved by setting the disableErrorMessages option:​
NestJS Documentation

typescript
Copy
Edit
app.useGlobalPipes(
  new ValidationPipe({
    disableErrorMessages: true,
  }),
);
With this configuration, the application will not expose detailed validation error messages in responses.​
NestJS Documentation

By leveraging NestJS's ValidationPipe in conjunction with class-validator and class-transformer, you can enforce robust validation rules, sanitize incoming data, and ensure that your application's data integrity is maintained effectively.​