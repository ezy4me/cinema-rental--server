import { DatabaseService } from '@database/database.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { CartService } from '@cart/cart.service';

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cartService: CartService,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.databaseService.user.findFirst({
      where: { email },
    });
  }

  async create(
    email: string,
    password: string,
    role?: string,
  ): Promise<User | undefined> {
    const _user = await this.findOne(email);

    if (_user) {
      throw new ConflictException('User with this email already exists');
    }

    const userRole = role !== undefined ? role : 'USER';

    const newUser = await this.databaseService.user.create({
      data: {
        email,
        password: this.hashPassword(password),
        role: userRole,
      },
    });

    await this.cartService.create(newUser.id);

    return newUser;
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(2));
  }
}
