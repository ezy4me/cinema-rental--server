import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartEquipmentModule } from './cart-equipment/cart-equipment.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [CartEquipmentModule],
  exports: [CartModule],
})
export class CartModule {}
