import { DatabaseService } from '@database/database.service';
import { Injectable } from '@nestjs/common';
import { Payment } from '@prisma/client';
import { PaymentDto } from './dto';

@Injectable()
export class PaymentService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllPayments(): Promise<Payment[]> {
    return this.databaseService.payment.findMany();
  }

  async getOnePaymentById(paymentId: number): Promise<Payment | null> {
    return this.databaseService.payment.findUnique({
      where: { id: paymentId },
    });
  }

  async createPayment(dto: PaymentDto): Promise<Payment> {
    return this.databaseService.payment.create({
      data: dto,
    });
  }

  async updatePayment(paymentId: number, dto: PaymentDto): Promise<Payment> {
    return this.databaseService.payment.update({
      where: { id: paymentId },
      data: dto,
    });
  }

  async deletePayment(paymentId: number): Promise<Payment | null> {
    return this.databaseService.payment.delete({
      where: { id: paymentId },
    });
  }
}
