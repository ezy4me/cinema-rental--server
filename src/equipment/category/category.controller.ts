import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  ParseIntPipe,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '@prisma/client';
import { CategoryDto } from './dto';
import { Public } from '@common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get()
  async getAllCategorys(): Promise<Category[]> {
    return this.categoryService.getAllCategorys();
  }

  @Public()
  @Get(':categoryId')
  async getOneCategoryById(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<Category | null> {
    return this.categoryService.getOneCategoryById(categoryId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createCategory(
    @UploadedFile() file: Express.Multer.File,
    @Body() categoryDto: CategoryDto,
  ): Promise<Category> {
    return this.categoryService.createCategory(categoryDto, file);
  }

  @Put(':categoryId')
  async updateCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() categoryDto: CategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(categoryId, categoryDto);
  }

  @Delete(':categoryId')
  async deleteCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<Category | null> {
    return this.categoryService.deleteCategory(categoryId);
  }
}
