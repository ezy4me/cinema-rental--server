import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CartService } from '@cart/cart.service';
import { CartModule } from '@cart/cart.module';
import { CustomerModule } from 'src/customer/customer.module';
import { CustomerService } from 'src/customer/customer.service';

@Module({
  providers: [UserService, CartService, CustomerService],
  imports: [CartModule, CustomerModule],
  controllers: [UserController],
})
export class UserModule {}
