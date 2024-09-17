import { IsInt, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEquipmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pricePerDay: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  statusId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  brandId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}

export class UpdateEquipmentDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  pricePerDay?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  quantity?: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  statusId?: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  brandId?: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  categoryId?: number;
}
