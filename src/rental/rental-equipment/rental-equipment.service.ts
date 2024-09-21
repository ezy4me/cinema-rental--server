import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { RentalEquipment } from '@prisma/client';
import { RentalEquipmentDto } from './dto';
import { CartService } from '@cart/cart.service';
import { CartEquipmentService } from '@cart/cart-equipment/cart-equipment.service';

@Injectable()
export class RentalEquipmentService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cartService: CartService,
    private readonly cartEquipmentService: CartEquipmentService,
  ) {}

  async getAllRentalEquipments(): Promise<RentalEquipment[]> {
    return this.databaseService.rentalEquipment.findMany();
  }

  async getRentalEquipmentById(id: number): Promise<RentalEquipment | null> {
    return this.databaseService.rentalEquipment.findUnique({
      where: { id },
    });
  }

  async createRentalEquipment(
    rentalEquipmentDto: RentalEquipmentDto,
  ): Promise<RentalEquipment> {
    const res = this.databaseService.rentalEquipment.create({
      data: rentalEquipmentDto,
    });

    if (res) {
      const rental = await this.databaseService.rental.findUnique({
        where: { id: rentalEquipmentDto.rentalId },
      });

      const cart = await this.cartService.findOneByUserId(rental.userId);

      await this.cartEquipmentService.clearCart(cart.id);
    }

    return res;
  }

  async updateRentalEquipment(
    id: number,
    rentalEquipmentDto: RentalEquipmentDto,
  ): Promise<RentalEquipment> {
    return this.databaseService.rentalEquipment.update({
      where: { id },
      data: rentalEquipmentDto,
    });
  }

  async deleteRentalEquipment(id: number): Promise<RentalEquipment | null> {
    return this.databaseService.rentalEquipment.delete({
      where: { id },
    });
  }
}
