import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { File } from '@prisma/client';

@Injectable()
export class FileService {
  constructor(private readonly databaseService: DatabaseService) {}

  async uploadFile(file: Express.Multer.File): Promise<Partial<File>> {
    return this.databaseService.file.create({
      data: {
        filename: file.originalname,
        mimetype: file.mimetype,
        data: file.buffer,
      },
      select: {
        id: true,
        filename: true,
        mimetype: true,
      },
    });
  }

  async getFileById(id: number): Promise<{ data: Buffer; mimetype: string }> {
    const file = await this.databaseService.file.findUnique({
      where: { id },
      select: {
        data: true,
        mimetype: true,
      },
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    return file;
  }

  async deleteFile(id: number): Promise<Partial<File>> {
    return this.databaseService.file.delete({
      where: { id },
      select: {
        id: true,
        filename: true,
        mimetype: true,
      },
    });
  }
}
