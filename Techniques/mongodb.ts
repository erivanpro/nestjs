​Integrating MongoDB with a NestJS application can be efficiently achieved using the @nestjs/mongoose package, which leverages Mongoose, a popular Object Data Modeling (ODM) library for MongoDB. This integration facilitates schema definition, model creation, and database operations within a NestJS framework.​

Installation

Begin by installing the necessary packages:​

bash
Copy
Edit
npm install @nestjs/mongoose mongoose
Setting Up MongooseModule

After installation, import the MongooseModule into your root module (e.g., AppModule) and establish a connection to your MongoDB database:​

typescript
Copy
Edit
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest')],
})
export class AppModule {}
Replace 'mongodb://localhost/nest' with your MongoDB connection string as appropriate.​

Defining Schemas and Models

In Mongoose, schemas define the structure of documents within a collection. NestJS allows the use of decorators to create these schemas. For example, to define a Cat schema:​
NestJS Documentation

typescript
Copy
Edit
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
Here, the @Schema() decorator marks the class as a schema definition, and the @Prop() decorators define the properties of the schema.​
NestJS Documentation

Registering Schemas in Modules

To use the defined schema, register it within a module using the MongooseModule.forFeature() method:​
NestJS Documentation

typescript
Copy
Edit
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsService } from './cats.service';
import { Cat, CatSchema } from './schemas/cat.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
  providers: [CatsService],
})
export class CatsModule {}
Injecting Models into Services

With the schema registered, inject the corresponding model into a service using the @InjectModel() decorator:​
NestJS Documentation

typescript
Copy
Edit
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat, CatDocument } from './schemas/cat.schema';
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }
}
In this service, the catModel is used to create and retrieve Cat documents from the MongoDB database.​

Handling Multiple Database Connections

For applications requiring connections to multiple databases, establish each connection with a unique name:​

typescript
Copy
Edit
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/cats', {
      connectionName: 'catsConnection',
    }),
    MongooseModule.forRoot('mongodb://localhost/dogs', {
      connectionName: 'dogsConnection',
    }),
  ],
})
export class AppModule {}
When registering schemas for these connections, specify the connection name:​
NestJS Documentation

typescript
Copy
Edit
@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Cat.name, schema: CatSchema }],
      'catsConnection',
    ),
  ],
})
export class CatsModule {}
Using Middleware (Hooks) and Plugins

To apply middleware or plugins to schemas, utilize the forFeatureAsync() method:​
NestJS Documentation

typescript
Copy
Edit
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Cat.name,
        useFactory: () => {
          const schema = CatSchema;
          schema.pre('save', function () {
            console.log('Before saving a cat document');
          });
          schema.plugin(require('mongoose-autopopulate'));
          return schema;
        },
      },
    ]),
  ],
})
export class CatsModule {}
In this example, a pre-save hook and the mongoose-autopopulate plugin are added to the Cat schema.​
NestJS Documentation

Defining Subdocuments and Virtuals

For nested documents (subdocuments), define schemas accordingly:​
NestJS Documentation

typescript
Copy
Edit
@Schema()
export class Owner {
  @Prop()
  name: string;
}

export const OwnerSchema = SchemaFactory.createForClass(Owner);

@Schema()
export class Cat {
  @Prop()
  name: string;

  @Prop({ type: OwnerSchema })
  owner: Owner;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
To create virtual properties that are not stored in the database but computed dynamically:​
NestJS Documentation

typescript
Copy
Edit
@Schema()
export class Cat {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Virtual({
    get: function (this: Cat) {
      return `${this.firstName} ${this.lastName}`;
    },
  })
  fullName: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
In this case, fullName is a virtual property combining firstName and lastName.​
NestJS Documentation

By following these steps, you can effectively integrate MongoDB into your NestJS application using Mongoose, leveraging decorators and modules to create a robust and maintainable codebase.