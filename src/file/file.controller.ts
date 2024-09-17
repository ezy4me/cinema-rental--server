import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileService } from './file.service';
import { File } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '@common/decorators';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('files')
@Public()
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Partial<File>> {
    return this.fileService.uploadFile(file);
  }

  @Get(':id')
  async getFile(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const file = await this.fileService.getFileById(id);
    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `inline; filename="${id}"`,
    });
    res.send(file.data);
  }

  @Delete(':id')
  async deleteFile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Partial<File>> {
    return this.fileService.deleteFile(id);
  }
}
