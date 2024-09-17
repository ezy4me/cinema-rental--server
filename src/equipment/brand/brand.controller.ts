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
import { BrandService } from './brand.service';
import { Brand } from '@prisma/client';
import { BrandDto } from './dto';
import { Public } from '@common/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('brand')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Public()
  @Get()
  async getAllBrands(): Promise<Brand[]> {
    return this.brandService.getAllBrands();
  }

  @Public()
  @Get(':brandId')
  async getOneBrandById(
    @Param('brandId', ParseIntPipe) brandId: number,
  ): Promise<Brand | null> {
    return this.brandService.getOneBrandById(brandId);
  }

  @Post()
  async createBrand(@Body() brandDto: BrandDto): Promise<Brand> {
    return this.brandService.createBrand(brandDto);
  }

  @Put(':brandId')
  async updateBrand(
    @Param('brandId', ParseIntPipe) brandId: number,
    @Body() brandDto: BrandDto,
  ): Promise<Brand> {
    return this.brandService.updateBrand(brandId, brandDto);
  }

  @Delete(':brandId')
  async deleteBrand(
    @Param('brandId', ParseIntPipe) brandId: number,
  ): Promise<Brand | null> {
    return this.brandService.deleteBrand(brandId);
  }
}
