import { Module } from '@nestjs/common';
import { CartEquipmentController } from './cart-equipment.controller';
import { CartEquipmentService } from './cart-equipment.service';

@Module({
  controllers: [CartEquipmentController],
  providers: [CartEquipmentService],
})
export class CartEquipmentModule {}
