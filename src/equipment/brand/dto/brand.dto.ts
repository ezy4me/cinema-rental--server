import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BrandDto {
  @ApiProperty()
  @IsString()
  name: string;
}
