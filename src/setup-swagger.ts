import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('NestJS Task Management API')
    .setDescription('API documentation for Task Management System')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'token',
        description: 'Enter JWT token',
        in: 'header',
      },
      'token',
    );

  if (process.env.API_VERSION) {
    documentBuilder.setVersion(process.env.API_VERSION);
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
    deepScanRoutes: true,
  });

  const swaggerOptions = {
    swaggerOptions: {
      explore: true,
      deepLinking: true,
      persistAuthorization: true,
    },
  };

  SwaggerModule.setup('docs', app, document, swaggerOptions);
  SwaggerModule.setup('api-docs', app, document, swaggerOptions);
  SwaggerModule.setup('api/docs', app, document, swaggerOptions);
}
