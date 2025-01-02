import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 5000;
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: true,
      // transform: true,
      disableErrorMessages: false,
      enableDebugMessages: true,
      validationError: {
        target: false,
        value: true,
      },
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints ? Object.values(error.constraints) : [],
          value: error.value,
        }));
        return new BadRequestException(result);
      },
    }),
  );

  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const port = process.env.PORT || 5000;
//   app.use(json({ limit: '50mb' }));
//   app.use(urlencoded({ limit: '50mb', extended: true }));
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       skipMissingProperties: true,
//     }),
//   );
//   app.enableCors();
//   app.useGlobalFilters(new HttpExceptionFilter());
//   await app.listen(port);
//   console.log('Server is running on port ${port}');
// }
