import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
    ParseIntPipe,
    ParseUUIDPipe,
    ValidationPipe,
    UsePipes,
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    HttpStatus,
  } from '@nestjs/common';
  import { z, ZodSchema } from 'zod';
  import { CreateCatDto } from './dto/create-cat.dto'; // Assuming DTO is defined in a separate file
  
  // Custom Pipe for Validation using Zod Schema
  @Injectable()
  export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema<any>) {}
  
    transform(value: any, metadata: ArgumentMetadata) {
      try {
        // Validate the value against the provided Zod schema
        return this.schema.parse(value);
      } catch (error) {
        // Throw a BadRequestException if validation fails
        throw new BadRequestException('Validation failed');
      }
    }
  }
  
  // Example Zod schema for CreateCatDto
  const createCatSchema = z.object({
    name: z.string(),
    age: z.number().int(),
    breed: z.string(),
  });
  
  // Controller demonstrating the use of pipes
  @Controller('cats')
  export class CatsController {
    // POST /cats
    @Post()
    @UsePipes(new ZodValidationPipe(createCatSchema)) // Using custom ZodValidationPipe
    async create(@Body() createCatDto: CreateCatDto) {
      // Handle the creation of a new cat
      return 'This action adds a new cat';
    }
  
    // GET /cats/:id
    @Get(':id')
    async findOne(
      @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    ) {
      // Using ParseIntPipe to ensure 'id' is an integer
      return `This action returns a #${id} cat`;
    }
  
    // GET /cats
    @Get()
    async findAll(@Query('id', ParseIntPipe) id: number) {
      // Using ParseIntPipe to parse and validate 'id' query parameter
      return `This action returns all cats with id ${id}`;
    }
  
    // GET /cats/:uuid
    @Get(':uuid')
    async findOneByUuid(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
      // Using ParseUUIDPipe to validate UUID parameter
      return `This action returns a cat with UUID ${uuid}`;
    }
  }
  
  // Global Pipe Setup (e.g., in main.ts)
  // Applying ValidationPipe globally to automatically validate incoming requests
  // const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe());
  