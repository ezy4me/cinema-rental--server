import { DatabaseService } from '@database/database.service';
import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { StatusDto } from './dto';

@Injectable()
export class StatusService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllStatuss(): Promise<Status[]> {
    return this.databaseService.status.findMany();
  }

  async getOneStatusById(statusId: number): Promise<Status | null> {
    return this.databaseService.status.findUnique({
      where: { id: statusId },
    });
  }

  async createStatus(dto: StatusDto): Promise<Status> {
    return this.databaseService.status.create({
      data: dto,
    });
  }

  async updateStatus(statusId: number, dto: StatusDto): Promise<Status> {
    return this.databaseService.status.update({
      where: { id: statusId },
      data: dto,
    });
  }

  async deleteStatus(statusId: number): Promise<Status | null> {
    return this.databaseService.status.delete({
      where: { id: statusId },
    });
  }
}
