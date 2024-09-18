import { IsInt, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RentalDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  totalAmount: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
