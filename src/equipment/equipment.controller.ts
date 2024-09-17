import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto, UpdateEquipmentDto } from './_dto';
import { Equipment } from '@prisma/client';
import { Public } from '@common/decorators';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('equipment')
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Public()
  @Get()
  async findAll(): Promise<Equipment[]> {
    return this.equipmentService.findAll();
  }

  @Public()
  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number): Promise<Equipment> {
    return this.equipmentService.findOneById(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('file'))
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: CreateEquipmentDto,
  ): Promise<Equipment> {
    return this.equipmentService.create(dto, files);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('file'))
  async update(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEquipmentDto,
  ): Promise<Equipment> {
    return this.equipmentService.update(id, dto, files);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Equipment> {
    return this.equipmentService.delete(id);
  }
}
