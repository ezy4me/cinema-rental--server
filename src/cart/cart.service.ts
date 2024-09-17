import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Cart } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Cart[]> {
    return this.databaseService.cart.findMany();
  }

  async findOneById(id: number): Promise<Cart> {
    const cart = await this.databaseService.cart.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    return cart;
  }

  async create(userId: number): Promise<Cart> {
    return this.databaseService.cart.create({
      data: {
        userId,
      },
    });
  }

  async update(id: number, userId: number): Promise<Cart> {
    await this.findOneById(id);

    return this.databaseService.cart.update({
      where: { id },
      data: {
        userId,
      },
    });
  }

  async delete(id: number): Promise<Cart> {
    await this.findOneById(id);

    return this.databaseService.cart.delete({
      where: { id },
    });
  }
}
