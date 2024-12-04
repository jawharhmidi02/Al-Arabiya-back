import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 5000;
  console.log(`Server is running on port ${port}`);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: true,
    }),
  );
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(5000);
}
bootstrap();
