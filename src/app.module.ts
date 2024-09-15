import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseService } from '@database/database.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveRoot: '/static/images',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DatabaseService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
