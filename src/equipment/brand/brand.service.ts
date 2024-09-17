import { DatabaseService } from '@database/database.service';
import { Injectable } from '@nestjs/common';
import { Brand } from '@prisma/client';
import { BrandDto } from './dto';

@Injectable()
export class BrandService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllBrands(): Promise<Brand[]> {
    return this.databaseService.brand.findMany();
  }

  async getOneBrandById(brandId: number): Promise<Brand | null> {
    return this.databaseService.brand.findUnique({
      where: { id: brandId },
    });
  }

  async createBrand(dto: BrandDto): Promise<Brand> {
    return this.databaseService.brand.create({
      data: dto,
    });
  }

  async updateBrand(brandId: number, dto: BrandDto): Promise<Brand> {
    return this.databaseService.brand.update({
      where: { id: brandId },
      data: dto,
    });
  }

  async deleteBrand(brandId: number): Promise<Brand | null> {
    return this.databaseService.brand.delete({
      where: { id: brandId },
    });
  }
}
