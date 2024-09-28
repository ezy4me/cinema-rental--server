import { DatabaseService } from '@database/database.service';
import { Injectable } from '@nestjs/common';
import { Rental } from '@prisma/client';
import { RentalDto } from './dto';

@Injectable()
export class RentalService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllRentals(): Promise<Rental[]> {
    return this.databaseService.rental.findMany({
      include: {
        user: {
          include: {
            customer: true,
          },
        },
        rentalEquipment: {
          select: {
            equipment: {
              include: {
                category: true,
                brand: true,
              },
            },
          },
        },
      },
    });
  }

  async getOneRentalById(rentalId: number): Promise<Rental | null> {
    return this.databaseService.rental.findUnique({
      where: { id: rentalId },
    });
  }

  async createRental(dto: RentalDto): Promise<Rental> {
    return this.databaseService.rental.create({
      data: dto,
    });
  }

  async updateRental(rentalId: number, dto: RentalDto): Promise<Rental> {
    return this.databaseService.rental.update({
      where: { id: rentalId },
      data: dto,
    });
  }

  async deleteRental(rentalId: number): Promise<Rental | null> {
    return this.databaseService.rental.delete({
      where: { id: rentalId },
    });
  }

  async getRentalsByUserId(userId: number): Promise<Rental[] | null> {
    return this.databaseService.rental.findMany({
      where: { userId },
      include: {
        rentalEquipment: {
          include: {
            equipment: true,
          },
        },
      },
    });
  }
}
