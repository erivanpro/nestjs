​Integrating databases into a NestJS application is a fundamental task, and NestJS offers robust support for various databases through dedicated modules and decorators. This support simplifies the process of connecting to and interacting with databases.​

TypeORM Integration

TypeORM is a popular Object-Relational Mapping (ORM) library for TypeScript and JavaScript. NestJS provides an integration with TypeORM through the @nestjs/typeorm package. To set up TypeORM in your NestJS application:​

Installation: Install the necessary packages:​

bash
Copy
Edit
npm install --save @nestjs/typeorm typeorm mysql2
Configuration: Import the TypeOrmModule into your root module and configure it:​

typescript
Copy
Edit
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'test',
      password: 'test',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
In this configuration, entities specifies the paths to your entity files, and synchronize determines whether the database schema should be auto-synced with your entities (use with caution in production).

Creating Entities: Define entities using TypeORM's @Entity decorator:​

typescript
Copy
Edit
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;
}
Using Repositories: Inject repositories into your services to interact with the database:​

typescript
Copy
Edit
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
Sequelize Integration

Sequelize is another ORM that supports various SQL dialects. NestJS integrates with Sequelize through the @nestjs/sequelize package. To set up Sequelize:​

Installation: Install the required packages:​

bash
Copy
Edit
npm install --save @nestjs/sequelize sequelize sequelize-typescript mysql2
Configuration: Import the SequelizeModule into your root module and configure it:​

typescript
Copy
Edit
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'test',
      password: 'test',
      database: 'test',
      models: [__dirname + '/**/*.model.ts'],
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
Here, models specifies the paths to your model files, autoLoadModels enables automatic loading of models, and synchronize syncs the database schema with your models.

Defining Models: Create models using Sequelize's decorators:​

typescript
Copy
Edit
import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column({ defaultValue: true })
  isActive: boolean;
}
Using Models: Inject models into your services to perform database operations:​

typescript
Copy
Edit
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  findOne(id: number): Promise<User> {
    return this.userModel.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
Mongoose Integration

For applications using MongoDB, NestJS integrates with Mongoose through the @nestjs/mongoose package. To set up Mongoose:​

Installation: Install the necessary packages:​

bash
Copy
Edit
npm install --save @nestjs/mongoose mongoose
Configuration: Import the MongooseModule into your root module and configure it:​

typescript
Copy
Edit
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
  ],
})
export class AppModule {}
Defining Schemas: Create schemas using Mongoose's decorators:​

typescript
Copy
Edit
import { Prop, Schema, SchemaFactory }