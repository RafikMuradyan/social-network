import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function buildSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Social Network App')
    .setDescription('API description')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' });

  if (process.env.API_VERSION) {
    config.setVersion(process.env.API_VERSION);
  }

  const document = SwaggerModule.createDocument(app, config.build());

  SwaggerModule.setup('documentation', app, document, {
    customSiteTitle: 'Social Network App API Documentation',
    customfavIcon: 'https://avatars.githubusercontent.com/u/6936373?s=200&v=4',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });
}
