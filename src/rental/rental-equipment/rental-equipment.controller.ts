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
import { RentalEquipmentService } from './rental-equipment.service';
import { RentalEquipment } from '@prisma/client';
import { RentalEquipmentDto } from './dto';
import { Public } from '@common/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('rental-equipment')
@Controller('rental-equipment')
export class RentalEquipmentController {
  constructor(
    private readonly rentalEquipmentService: RentalEquipmentService,
  ) {}

  @Public()
  @Get()
  async getAllRentalEquipments(): Promise<RentalEquipment[]> {
    return this.rentalEquipmentService.getAllRentalEquipments();
  }

  @Public()
  @Get(':id')
  async getRentalEquipmentById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RentalEquipment | null> {
    return this.rentalEquipmentService.getRentalEquipmentById(id);
  }

  @Post()
  async createRentalEquipment(
    @Body() rentalEquipmentDto: RentalEquipmentDto,
  ): Promise<RentalEquipment> {
    return this.rentalEquipmentService.createRentalEquipment(
      rentalEquipmentDto,
    );
  }

  @Put(':id')
  async updateRentalEquipment(
    @Param('id', ParseIntPipe) id: number,
    @Body() rentalEquipmentDto: RentalEquipmentDto,
  ): Promise<RentalEquipment> {
    return this.rentalEquipmentService.updateRentalEquipment(
      id,
      rentalEquipmentDto,
    );
  }

  @Delete(':id')
  async deleteRentalEquipment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RentalEquipment | null> {
    return this.rentalEquipmentService.deleteRentalEquipment(id);
  }
}
