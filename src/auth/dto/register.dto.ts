import { IsPasswordMatchingConstraint } from '@common/decorators';
import { IsEmail, IsString, MinLength, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @Validate(IsPasswordMatchingConstraint)
  passwordRepeat: string;

  @ApiProperty()
  @IsString()
  role: string;
}
