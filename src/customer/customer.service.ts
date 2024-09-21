import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { Customer } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Customer[]> {
    return this.databaseService.customer.findMany();
  }

  async findOneByUserId(userId: number): Promise<Customer> {
    const customer = await this.databaseService.customer.findUnique({
      where: { userId },
    });

    return customer;
  }

  async findOneById(userId: number): Promise<Customer> {
    const customer = await this.databaseService.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${userId} not found`);
    }

    return customer;
  }

  async create(dto: CreateCustomerDto): Promise<Customer> {
    return this.databaseService.customer.create({
      data: {
        firstName: dto.firstName,
        secondName: dto.secondName,
        lastName: dto.lastName,
        phone: dto.phone,
        userId: dto.userId,
      },
    });
  }

  async update(id: number, dto: UpdateCustomerDto): Promise<Customer> {
    return this.databaseService.customer.update({
      where: { userId: id },
      data: {
        ...dto,
      },
    });
  }

  async delete(id: number): Promise<Customer> {
    await this.findOneById(id);

    return this.databaseService.customer.delete({
      where: { id },
    });
  }
}
