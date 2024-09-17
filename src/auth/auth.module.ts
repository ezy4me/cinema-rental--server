import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@user/user.module';
import { options } from './config';
import { STRATEGIES } from './strategies';
import { GUARDS } from './guards';
import { UserService } from '@user/user.service';
import { CartModule } from '@cart/cart.module';
import { CartService } from '@cart/cart.service';

@Module({
  providers: [AuthService, ...STRATEGIES, ...GUARDS, UserService, CartService],
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.registerAsync(options()),
    UserModule,
    CartModule,
  ],
})
export class AuthModule {}
