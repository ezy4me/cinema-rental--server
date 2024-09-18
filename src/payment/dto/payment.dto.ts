import { IsInt, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  rentalId: number;
}
