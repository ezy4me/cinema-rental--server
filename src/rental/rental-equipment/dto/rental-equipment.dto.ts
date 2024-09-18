import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RentalEquipmentDto {
  @ApiProperty()
  @IsNumber()
  rentalId: number;

  @ApiProperty()
  @IsNumber()
  equipmentId: number;
}
