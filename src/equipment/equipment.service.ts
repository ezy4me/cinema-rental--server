import { Injectable, NotFoundException } from '@nestjs/common';
import { Equipment } from '@prisma/client';
import { DatabaseService } from '@database/database.service';
import { CreateEquipmentDto, UpdateEquipmentDto } from './_dto';
import { FileService } from '../file/file.service';

@Injectable()
export class EquipmentService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly fileService: FileService,
  ) {}

  async findAll(): Promise<Equipment[]> {
    return this.databaseService.equipment.findMany();
  }

  async findOneById(id: number): Promise<Equipment> {
    const equipment = await this.databaseService.equipment.findUnique({
      where: { id },
    });

    if (!equipment) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }

    return equipment;
  }

  async create(
    dto: CreateEquipmentDto,
    files: Array<Express.Multer.File>,
  ): Promise<Equipment> {
    const file = files[0];
    let fileId: number | null = null;

    if (file) {
      const uploadedFile = await this.fileService.uploadFile(file);
      fileId = uploadedFile.id;
    }

    return this.databaseService.equipment.create({
      data: {
        name: dto.name,
        description: dto.description,
        pricePerDay: dto.pricePerDay,
        fileId: fileId,
        quantity: parseInt(dto.quantity.toString()),
        statusId: parseInt(dto.statusId.toString()),
        brandId: parseInt(dto.brandId.toString()),
        categoryId: parseInt(dto.categoryId.toString()),
      },
    });
  }

  async update(
    id: number,
    dto: UpdateEquipmentDto,
    files?: Array<Express.Multer.File>,
  ): Promise<Equipment> {
    await this.findOneById(id);

    let fileId: number | null = null;
    if (files && files.length > 0) {
      const file = files[0];
      const uploadedFile = await this.fileService.uploadFile(file);
      fileId = uploadedFile.id;
    }

    return this.databaseService.equipment.update({
      where: { id },
      data: {
        ...dto,
        fileId: fileId ?? undefined,
      },
    });
  }

  async delete(id: number): Promise<Equipment> {
    await this.findOneById(id);

    return this.databaseService.equipment.delete({
      where: { id },
    });
  }
}
