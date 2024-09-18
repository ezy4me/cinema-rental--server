import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { RentalEquipment } from '@prisma/client';
import { RentalEquipmentDto } from './dto';

@Injectable()
export class RentalEquipmentService {
  constructor(private readonly databaseService: DatabaseService) {}

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
    return this.databaseService.rentalEquipment.create({
      data: rentalEquipmentDto,
    });
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
