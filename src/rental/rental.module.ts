import { Module } from '@nestjs/common';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { RentalEquipmentModule } from './rental-equipment/rental-equipment.module';

@Module({
  controllers: [RentalController],
  providers: [RentalService],
  imports: [RentalEquipmentModule]
})
export class RentalModule {}
