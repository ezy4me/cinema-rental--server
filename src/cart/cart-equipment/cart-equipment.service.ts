import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { CartEquipment } from '@prisma/client';

@Injectable()
export class CartEquipmentService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllByCartId(cartId: number): Promise<CartEquipment[]> {
    return this.databaseService.cartEquipment.findMany({
      where: { cartId },
    });
  }

  async addEquipmentToCart(
    cartId: number,
    equipmentId: number,
    quantity: number,
  ): Promise<CartEquipment> {
    return this.databaseService.cartEquipment.create({
      data: {
        cartId,
        equipmentId,
        quantity,
      },
    });
  }

  async updateEquipmentQuantity(
    cartEquipmentId: number,
    quantity: number,
  ): Promise<CartEquipment> {
    const cartEquipment = await this.databaseService.cartEquipment.findUnique({
      where: { id: cartEquipmentId },
    });

    if (!cartEquipment) {
      throw new NotFoundException(
        `CartEquipment with ID ${cartEquipmentId} not found`,
      );
    }

    return this.databaseService.cartEquipment.update({
      where: { id: cartEquipmentId },
      data: { quantity },
    });
  }

  async removeEquipmentFromCart(
    cartEquipmentId: number,
  ): Promise<CartEquipment> {
    const cartEquipment = await this.databaseService.cartEquipment.findUnique({
      where: { id: cartEquipmentId },
    });

    if (!cartEquipment) {
      throw new NotFoundException(
        `CartEquipment with ID ${cartEquipmentId} not found`,
      );
    }

    return this.databaseService.cartEquipment.delete({
      where: { id: cartEquipmentId },
    });
  }
}
