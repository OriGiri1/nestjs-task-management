import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionsFilter } from '@core/filters/global-exception-filter';
import { ProjectLogger } from '@core/loggers';
import { ConfigService } from '@nestjs/config';
import { requestLoggerMiddleware } from '@shared/middleware/request-logger.middleware';
import { setupSwagger } from './setup-swagger';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

const logger = new ProjectLogger('bootstrap');

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );
  app.setGlobalPrefix('/api');
  app.use(requestLoggerMiddleware);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      transform: true,
    }),
  );

  setupSwagger(app);

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  const config = app.get<ConfigService>(ConfigService);
  // app.useGlobalFilters(new GlobalExceptionsFilter(config));

  const port = config.get('PORT') || 3000;
  await app.listen(port, '0.0.0.0', async () => {
    logger.info(`Application is running on: http://0.0.0.0:${port}`);
  });

  return app;
}
bootstrap();
