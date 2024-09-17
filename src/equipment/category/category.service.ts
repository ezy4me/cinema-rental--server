import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Category } from '@prisma/client';
import { CategoryDto } from './dto';
import { FileService } from '@file/file.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly fileService: FileService,
  ) {}

  async getAllCategorys(): Promise<Category[]> {
    return this.databaseService.category.findMany();
  }

  async getOneCategoryById(categoryId: number): Promise<Category | null> {
    return this.databaseService.category.findUnique({
      where: { id: categoryId },
    });
  }

  async createCategory(
    dto: CategoryDto,
    file: Express.Multer.File,
  ): Promise<Category> {
    const uploadedFile = await this.fileService.uploadFile(file);

    return this.databaseService.category.create({
      data: {
        ...dto,
        fileId: uploadedFile.id,
      },
    });
  }

  async updateCategory(
    categoryId: number,
    dto: CategoryDto,
  ): Promise<Category> {
    return this.databaseService.category.update({
      where: { id: categoryId },
      data: dto,
    });
  }

  async deleteCategory(categoryId: number): Promise<Category | null> {
    return this.databaseService.category.delete({
      where: { id: categoryId },
    });
  }
}
