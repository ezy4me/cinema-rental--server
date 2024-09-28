import { Module } from '@nestjs/common';
import { EquipmentController } from './equipment.controller';
import { EquipmentService } from './equipment.service';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';

@Module({
  controllers: [EquipmentController],
  providers: [EquipmentService],
  imports: [BrandModule, CategoryModule],
})
export class EquipmentModule {}
