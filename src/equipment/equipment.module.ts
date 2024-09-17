import { Module } from '@nestjs/common';
import { EquipmentController } from './equipment.controller';
import { EquipmentService } from './equipment.service';
import { StatusModule } from './status/status.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';

@Module({
  controllers: [EquipmentController],
  providers: [EquipmentService],
  imports: [StatusModule, BrandModule, CategoryModule]
})
export class EquipmentModule {}
