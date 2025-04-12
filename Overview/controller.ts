// Import necessary decorators and types from NestJS
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Query,
    Param,
    Res,
    HttpStatus,
    HttpCode,
    Header,
    Redirect,
    Req,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  // Data Transfer Object (DTO) for creating a cat
  export class CreateCatDto {
    name: string;
    age: number;
    breed: string;
  }
  
  // Data Transfer Object (DTO) for updating a cat
  export class UpdateCatDto {
    name?: string;
    age?: number;
    breed?: string;
  }
  
  // DTO for listing all entities with optional limit
  export class ListAllEntities {
    limit: number;
  }
  
  // Controller to handle 'cats' routes
  @Controller('cats')
  export class CatsController {
    // POST /cats
    // Handler to create a new cat
    @Post()
    @HttpCode(201) // Sets the response status code to 201 (Created)
    @Header('Cache-Control', 'none') // Sets a custom header
    create(@Body() createCatDto: CreateCatDto) {
      // In a real application, you would save the cat to the database here
      return { message: 'Cat successfully created', cat: createCatDto };
    }
  
    // GET /cats
    // Handler to retrieve all cats with optional query parameter for limit
    @Get()
    findAll(@Query() query: ListAllEntities) {
      // In a real application, you would retrieve cats from the database here
      return {
        message: `This action returns all cats (limit: ${query.limit} items)`,
        cats: [], // This would be replaced with actual cats data
      };
    }
  
    // GET /cats/docs
    // Handler to redirect to the documentation
    @Get('docs')
    @Redirect('https://docs.nestjs.com/controllers', 302)
    getDocs(@Query('version') version) {
      const url = version
        ? `https://docs.nestjs.com/v${version}/controllers`
        : 'https://docs.nestjs.com/controllers';
      return { url };
    }
  
    // GET /cats/:id
    // Handler to retrieve a specific cat by ID
    @Get(':id')
    findOne(@Param('id') id: string) {
      // In a real application, you would retrieve the cat from the database here
      return { message: `This action returns cat #${id}`, cat: {} };
    }
  
    // PUT /cats/:id
    // Handler to update a specific cat by ID
    @Put(':id')
    update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
      // In a real application, you would update the cat in the database here
      return {
        message: `This action updates cat #${id}`,
        updatedCat: updateCatDto,
      };
    }
  
    // DELETE /cats/:id
    // Handler to remove a specific cat by ID
    @Delete(':id')
    remove(@Param('id') id: string) {
      // In a real application, you would remove the cat from the database here
      return { message: `This action removes cat #${id}` };
    }
  
    // GET /cats/express
    // Handler demonstrating the use of the Express response object
    @Get('express')
    findAllExpress(@Res() res: Response) {
      // Using Express response object to send a custom response
      res.status(HttpStatus.OK).json({
        message: 'This action returns all cats using Express response',
        cats: [],
      });
    }
  
    // GET /cats/request
    // Handler demonstrating the use of the Express request object
    @Get('request')
    findAllRequest(@Req() req: Request) {
      // Accessing request information
      const userAgent = req.headers['user-agent'] || 'unknown';
      return {
        message: 'This action returns all cats with request info',
        userAgent,
        cats: [],
      };
    }
  }
  
  // Import necessary modules from NestJS
  import { Module } from '@nestjs/common';
  
  // Main application module
  @Module({
    controllers: [CatsController], // Registering the CatsController
  })
  export class AppModule {}
  
  // Import NestFactory to create the application instance
  import { NestFactory } from '@nestjs/core';
  
  // Bootstrap function to initialize the application
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000); // The application listens on port 3000
  }
  bootstrap();
  