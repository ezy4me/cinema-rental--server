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
  ImageRun,
} from 'docx';
import { Response } from 'express';
import * as QRCode from 'qrcode';

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
        user: { include: { customer: true } },
        status: true,
        rentalEquipment: {
          include: {
            equipment: { include: { category: true, brand: true } },
          },
        },
      },
    });

    if (!rental) {
      throw new Error('Rental not found');
    }

    const qrCodeDataUrl = await QRCode.toDataURL(
      `https://payment.example.com/pay?rentalId=${rentalId}`,
    );
    const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');

    const qrImage = new ImageRun({
      data: qrCodeBuffer,
      transformation: { width: 100, height: 100 },
      type: 'png',
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'ДОГОВОР АРЕНДЫ № ' + rentalId,
                  bold: true,
                  size: 32,
                }),
              ],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `г. Казань \t\t ${new Date().toLocaleDateString()}`,
                  bold: true,
                }),
              ],
              alignment: AlignmentType.RIGHT,
              spacing: { after: 300 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: '1. Информация о заказчике',
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { after: 200 },
            }),

            new Paragraph({
              text: `${rental.user.customer.firstName} ${rental.user.customer.secondName} ${rental.user.customer.lastName}`,
            }),
            new Paragraph({ text: `Email: ${rental.user.email}` }),
            new Paragraph({ text: `Телефон: ${rental.user.customer.phone}` }),

            new Paragraph({
              children: [
                new TextRun({
                  text: '2. Условия аренды',
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { after: 200 },
            }),

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
                  text: `Сумма к оплате: ${rental.totalAmount} руб.`,
                  bold: true,
                  size: 28,
                }),
              ],
              spacing: { after: 300 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: '3. Арендованное оборудование',
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { after: 200 },
            }),

            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: 'Название', bold: true }),
                          ],
                        }),
                      ],
                      width: { size: 30, type: WidthType.PERCENTAGE },
                      shading: { fill: 'd9d9d9' },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: 'Категория', bold: true }),
                          ],
                        }),
                      ],
                      width: { size: 25, type: WidthType.PERCENTAGE },
                      shading: { fill: 'd9d9d9' },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: 'Бренд', bold: true }),
                          ],
                        }),
                      ],
                      width: { size: 25, type: WidthType.PERCENTAGE },
                      shading: { fill: 'd9d9d9' },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: 'Количество', bold: true }),
                          ],
                        }),
                      ],
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

            new Paragraph({ spacing: { before: 400 } }),
            new Paragraph({
              children: [
                new TextRun({
                  text: '4. Оплата',
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'QR-код для оплаты:',
                  bold: true,
                  size: 24,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [qrImage],
              alignment: AlignmentType.CENTER,
            }),

            new Paragraph({ spacing: { before: 400 } }),
            new Paragraph({
              children: [
                new TextRun({
                  text: '5. Подписи сторон',
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [new TextRun({ text: 'Арендодатель: ___________' })],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [new TextRun({ text: 'Арендатор: ___________' })],
              spacing: { after: 100 },
            }),

            new Paragraph({ spacing: { before: 400 } }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Спасибо за сотрудничество!',
                  bold: true,
                  size: 24,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=rental_agreement.docx',
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    res.send(buffer);
  }
}
