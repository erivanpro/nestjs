​Serialization in NestJS is the process of transforming objects before they are returned in a network response, ensuring that sensitive data is excluded and that the response structure adheres to the desired format. This is particularly useful for omitting confidential information, like passwords, from user entities. ​
NestJS Documentation

Setting Up Serialization

NestJS utilizes the ClassSerializerInterceptor along with the class-transformer package to facilitate serialization. To implement this, first install the required package:​
NestJS Documentation

bash
Copy
Edit
npm install class-transformer
Then, apply the ClassSerializerInterceptor at the controller level:​
NestJS Documentation

typescript
Copy
Edit
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  @Get()
  findAll(): UserEntity[] {
    // Fetch and return users
  }
}
For application-wide serialization, set up the interceptor globally:​

typescript
Copy
Edit
import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(3000);
}
bootstrap();
Excluding Sensitive Properties

To exclude properties such as passwords from the serialized output, use the @Exclude() decorator from class-transformer:​
NestJS Documentation

typescript
Copy
Edit
import { Exclude } from 'class-transformer';

export class UserEntity {
  id: number;
  firstName: string;
  lastName: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
Ensure that instances of the class are returned to allow the interceptor to properly serialize the response. ​
NestJS Documentation

Exposing and Transforming Properties

The @Expose() decorator can be used to customize the exposure of properties, such as creating virtual fields:​
NestJS Documentation

typescript
Copy
Edit
import { Expose } from 'class-transformer';

export class UserEntity {
  firstName: string;
  lastName: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
Additionally, the @Transform() decorator allows for custom transformations on properties:​

typescript
Copy
Edit
import { Transform } from 'class-transformer';

export class UserEntity {
  @Transform(({ value }) => value.name)
  role: RoleEntity;
}
Customizing Serialization Options

To modify serialization behavior, use the @SerializeOptions() decorator:​
NestJS Documentation

typescript
Copy
Edit
import { SerializeOptions } from '@nestjs/common';

@SerializeOptions({
  excludePrefixes: ['_'],
})
export class UserEntity {
  _internalProperty: string;
  visibleProperty: string;
}
This configuration excludes properties with names starting with an underscore from the serialized output. ​
NestJS Documentation

By leveraging these decorators and interceptors, NestJS provides a robust mechanism for controlling the serialization process, ensuring that responses are both secure and tailored to application requirements.