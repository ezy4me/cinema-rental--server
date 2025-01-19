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
import { StatusService } from './status.service';
import { Status } from '@prisma/client';
import { StatusDto } from './dto';
import { Public } from '@common/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('status')
@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Public()
  @Get()
  async getAllStatuss(): Promise<Status[]> {
    return this.statusService.getAllStatuses();
  }

  @Public()
  @Get(':statusId')
  async getOneStatusById(
    @Param('statusId', ParseIntPipe) statusId: number,
  ): Promise<Status | null> {
    return this.statusService.getOneStatusById(statusId);
  }

  @Post()
  async createStatus(@Body() statusDto: StatusDto): Promise<Status> {
    return this.statusService.createStatus(statusDto);
  }

  @Put(':statusId')
  async updateStatus(
    @Param('statusId', ParseIntPipe) statusId: number,
    @Body() statusDto: StatusDto,
  ): Promise<Status> {
    return this.statusService.updateStatus(statusId, statusDto);
  }

  @Delete(':statusId')
  async deleteStatus(
    @Param('statusId', ParseIntPipe) statusId: number,
  ): Promise<Status | null> {
    return this.statusService.deleteStatus(statusId);
  }
}
