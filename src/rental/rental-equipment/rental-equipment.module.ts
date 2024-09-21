import { Module } from '@nestjs/common';
import { RentalEquipmentController } from './rental-equipment.controller';
import { RentalEquipmentService } from './rental-equipment.service';
import { CartService } from '@cart/cart.service';
import { CartEquipmentService } from '@cart/cart-equipment/cart-equipment.service';

@Module({
  controllers: [RentalEquipmentController],
  providers: [RentalEquipmentService, CartService, CartEquipmentService],
})
export class RentalEquipmentModule {}
