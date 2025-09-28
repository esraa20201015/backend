/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  console.log('Starting NestJS bootstrap...');

  // Create the app with proper body size configuration
  let app;
  try {
    app = await NestFactory.create(AppModule);
    
    // Configure body parser for large file uploads (10MB limit)
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));
    
    console.log('Nest application created');
  } catch (err) {
    console.error(' Failed to create Nest application:', err);
    process.exit(1);
  }

  //  Enable CORS so frontend (5173) can call backend (4002)
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Setup global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  console.log(' ValidationPipe configured');

  // Setup Swagger
  try {
    const config = new DocumentBuilder()
      .setTitle('Talent Hunting API')
      .setDescription(`
        ## Talent Hunting System API Documentation
        
        This API provides comprehensive endpoints for managing:
        - **Authentication**: User sign-up, sign-in, token refresh
        - **User Management**: CRUD operations for users, roles, companies
        - **Recruitment**: Job opportunities and applications
        - **Admin Functions**: Categories, departments, lookups
        
        ### Authentication
        Most endpoints require authentication using JWT Bearer tokens. 
        Include the token in the Authorization header: \`Bearer <your-token>\`
        
        ### Role-Based Access Control
        - **admin**: Full system access
        - **recruitment_user**: Can manage job opportunities and applications
        - **candidate_user**: Can view opportunities and submit applications
        - **hr_user**: Human resources functions
        - **manager**: Management-level access
        
        ### Getting Started
        1. Sign up a new user or sign in with existing credentials
        2. Use the returned access token for authenticated requests
        3. Refresh tokens when access tokens expire
      `)
      .setVersion('1.0')
      .setContact('Development Team', 'https://yourcompany.com', 'dev@yourcompany.com')
      .setLicense('MIT', 'https://opensource.org/licenses/MIT')
      .addBearerAuth(
        { 
          type: 'http', 
          scheme: 'bearer', 
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        },
        'access-token',
      )
      .addTag('Authentication', 'User authentication and token management')
      .addTag('Users', 'User management operations')
      .addTag('Roles', 'Role management (Admin only)')
      .addTag('Companies', 'Company management')
      .addTag('Categories', 'Job category management')
      .addTag('Departments', 'Department management')
      .addTag('Opportunities', 'Job opportunity management')
      .addTag('Applications', 'Job application management')
      .addTag('Lookups', 'System lookup management')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    console.log(' Swagger setup complete');
  } catch (err) {
    console.error(' Swagger setup failed:', err);
  }

  // Start the server
  try {
    const port = process.env.PORT ?? 4002;
    await app.listen(port);
    console.log(` Application is running on: http://localhost:${port}`);
  } catch (err) {
    console.error(' Failed to start server:', err);
  }
}

bootstrap();
