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
import { EquipmentModule } from './equipment/equipment.module';
import { FileModule } from './file/file.module';
import { FileService } from './file/file.service';
import { CustomerModule } from './customer/customer.module';
import { CartModule } from './cart/cart.module';
import { PaymentModule } from './payment/payment.module';
import { RentalModule } from './rental/rental.module';
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
    EquipmentModule,
    FileModule,
    CustomerModule,
    CartModule,
    PaymentModule,
    RentalModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DatabaseService,
    FileService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
