import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { CartEquipment } from '@prisma/client';

@Injectable()
export class CartEquipmentService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllByCartId(cartId: number): Promise<CartEquipment[]> {
    return this.databaseService.cartEquipment.findMany({
      where: { cartId },
      include: {
        equipment: true,
      },
    });
  }

  async addEquipmentToCart(
    cartId: number,
    equipmentId: number,
  ): Promise<CartEquipment> {
    let cartEquipment = await this.databaseService.cartEquipment.findFirst({
      where: {
        cartId,
        equipmentId,
      },
    });

    if (cartEquipment) {
      cartEquipment = await this.databaseService.cartEquipment.update({
        where: { id: cartEquipment.id },
        data: { quantity: cartEquipment.quantity + 1 },
      });
    } else {
      cartEquipment = await this.databaseService.cartEquipment.create({
        data: {
          cartId,
          equipmentId,
          quantity: 1,
        },
      });
    }

    return cartEquipment;
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
