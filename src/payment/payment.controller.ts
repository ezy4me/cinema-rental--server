import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from '@prisma/client';
import { PaymentDto } from './dto';
import { Public } from '@common/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Get()
  async getAllPayments(): Promise<Payment[]> {
    return this.paymentService.getAllPayments();
  }

  @Public()
  @Get(':paymentId')
  async getOnePaymentById(
    @Param('paymentId', ParseIntPipe) paymentId: number,
  ): Promise<Payment | null> {
    return this.paymentService.getOnePaymentById(paymentId);
  }

  @Post()
  async createPayment(@Body() paymentDto: PaymentDto): Promise<Payment> {
    return this.paymentService.createPayment(paymentDto);
  }

  @Put(':paymentId')
  async updatePayment(
    @Param('paymentId', ParseIntPipe) paymentId: number,
    @Body() paymentDto: PaymentDto,
  ): Promise<Payment> {
    return this.paymentService.updatePayment(paymentId, paymentDto);
  }

  @Delete(':paymentId')
  async deletePayment(
    @Param('paymentId', ParseIntPipe) paymentId: number,
  ): Promise<Payment | null> {
    return this.paymentService.deletePayment(paymentId);
  }
}
