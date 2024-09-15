import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

export class UserResponse implements User {
  id: number;

  @IsString()
  email: string;

  @Exclude()
  password: string;

  @IsString()
  role: string;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
