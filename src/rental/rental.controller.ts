import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  ParseIntPipe,
  Delete,
  Res,
} from '@nestjs/common';
import { RentalService } from './rental.service';
import { Rental } from '@prisma/client';
import { RentalDto } from './dto';
import { Public } from '@common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('rental')
@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Public()
  @Get()
  async getAllRentals(): Promise<Rental[]> {
    return this.rentalService.getAllRentals();
  }

  @Public()
  @Get(':rentalId')
  async getOneRentalById(
    @Param('rentalId', ParseIntPipe) rentalId: number,
  ): Promise<Rental | null> {
    return this.rentalService.getOneRentalById(rentalId);
  }

  @Post()
  async createRental(@Body() rentalDto: RentalDto): Promise<Rental> {
    return this.rentalService.createRental(rentalDto);
  }

  @Put(':rentalId')
  async updateRental(
    @Param('rentalId', ParseIntPipe) rentalId: number,
    @Body() rentalDto: RentalDto,
  ): Promise<Rental> {
    return this.rentalService.updateRental(rentalId, rentalDto);
  }

  @Delete(':rentalId')
  async deleteRental(
    @Param('rentalId', ParseIntPipe) rentalId: number,
  ): Promise<Rental | null> {
    return this.rentalService.deleteRental(rentalId);
  }

  @Public()
  @Get('/user/:userId')
  async getRentalsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Rental[] | null> {
    return this.rentalService.getRentalsByUserId(userId);
  }

  @Put(':rentalId/status')
  async updateRentalStatus(
    @Param('rentalId', ParseIntPipe) rentalId: number,
    @Body('statusId', ParseIntPipe) statusId: number,
  ): Promise<Rental> {
    return this.rentalService.updateRentalStatus(rentalId, statusId);
  }

  @Public()
  @Get(':rentalId/document')
  async generateRentalDocument(
    @Param('rentalId', ParseIntPipe) rentalId: number,
    @Res() res: Response,
  ) {
    return this.rentalService.generateRentalDocument(rentalId, res);
  }
}
