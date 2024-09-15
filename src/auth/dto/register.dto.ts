import { IsPasswordMatchingConstraint } from '@common/decorators';
import { IsEmail, IsString, MinLength, Validate } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsString()
  @MinLength(5)
  @Validate(IsPasswordMatchingConstraint)
  passwordRepeat: string;

  @IsString()
  role: string;
}
