import { DatabaseService } from '@database/database.service';
import { Injectable } from '@nestjs/common';
import { Rental } from '@prisma/client';
import { RentalDto } from './dto';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  TextRun,
} from 'docx';
import { Response } from 'express';

@Injectable()
export class RentalService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllRentals(): Promise<Rental[]> {
    return this.databaseService.rental.findMany({
      include: {
        user: {
          include: {
            customer: true,
          },
        },
        status: true,
        rentalEquipment: {
          select: {
            equipment: {
              include: {
                category: true,
                brand: true,
              },
            },
          },
        },
      },
    });
  }

  async getOneRentalById(rentalId: number): Promise<Rental | null> {
    return this.databaseService.rental.findUnique({
      where: { id: rentalId },
    });
  }

  async createRental(dto: RentalDto): Promise<Rental> {
    return this.databaseService.rental.create({
      data: dto,
    });
  }

  async updateRental(rentalId: number, dto: RentalDto): Promise<Rental> {
    return this.databaseService.rental.update({
      where: { id: rentalId },
      data: dto,
    });
  }

  async deleteRental(rentalId: number): Promise<Rental | null> {
    return this.databaseService.rental.delete({
      where: { id: rentalId },
    });
  }

  async getRentalsByUserId(userId: number): Promise<Rental[] | null> {
    return this.databaseService.rental.findMany({
      where: { userId },
      include: {
        status: true,
        rentalEquipment: {
          include: {
            equipment: true,
          },
        },
      },
    });
  }

  async updateRentalStatus(
    rentalId: number,
    statusId: number,
  ): Promise<Rental> {
    return this.databaseService.rental.update({
      where: { id: rentalId },
      data: {
        statusId: statusId,
      },
      include: {
        status: true,
      },
    });
  }

  async generateRentalDocument(rentalId: number, res: Response): Promise<void> {
    const rental = await this.databaseService.rental.findUnique({
      where: { id: rentalId },
      include: {
        user: {
          include: {
            customer: true,
          },
        },
        status: true,
        rentalEquipment: {
          include: {
            equipment: {
              include: {
                category: true,
                brand: true,
              },
            },
          },
        },
      },
    });

    if (!rental) {
      throw new Error('Rental not found');
    }

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Информация о заказе аренды',
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Дата заказа: ${new Date(rental.startDate).toLocaleDateString()}`,
                  bold: true,
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Информация о клиенте:', bold: true }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: `${rental.user.customer.firstName} ${rental.user.customer.secondName} ${rental.user.customer.lastName}`,
            }),
            new Paragraph({ text: `Email: ${rental.user.email}` }),
            new Paragraph({ text: `Телефон: ${rental.user.customer.phone}` }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Статус аренды: ${rental.status.name}`,
                  bold: true,
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Сумма: ${rental.totalAmount} руб.`,
                  bold: true,
                }),
              ],
              spacing: { after: 300 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Список арендованного оборудования:',
                  bold: true,
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 100 },
            }),

            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ text: 'Название товара' })],
                      width: { size: 30, type: WidthType.PERCENTAGE },
                      shading: { fill: 'd9d9d9' },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: 'Категория' })],
                      width: { size: 25, type: WidthType.PERCENTAGE },
                      shading: { fill: 'd9d9d9' },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: 'Бренд' })],
                      width: { size: 25, type: WidthType.PERCENTAGE },
                      shading: { fill: 'd9d9d9' },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: 'Количество' })],
                      width: { size: 20, type: WidthType.PERCENTAGE },
                      shading: { fill: 'd9d9d9' },
                    }),
                  ],
                }),

                ...rental.rentalEquipment.map(
                  (item) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({ text: item.equipment.name }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              text: item.equipment.category.name,
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({ text: item.equipment.brand.name }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({ text: item.quantity.toString() }),
                          ],
                        }),
                      ],
                    }),
                ),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Спасибо за использование наших услуг!',
                  bold: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 400 },
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=rental_order.docx',
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    res.send(buffer);
  }
}
