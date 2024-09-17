import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CartService } from '@cart/cart.service';
import { CartModule } from '@cart/cart.module';

@Module({
  providers: [UserService, CartService],
  imports: [CartModule],
  controllers: [UserController],
})
export class UserModule {}
