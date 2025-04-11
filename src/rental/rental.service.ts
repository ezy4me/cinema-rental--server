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

    // Генерация QR-кода для оплаты
    const qrCodeDataUrl = await QRCode.toDataURL(
      `https://payment.example.com/pay?rentalId=${rentalId}`,
    );
    const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');

    const qrImage = new ImageRun({
      data: qrCodeBuffer,
      transformation: { width: 100, height: 100 },
      type: 'png',
    });

    // Форматирование дат
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    };

    // Форматирование списка оборудования
    const equipmentList = rental.rentalEquipment
      .map(
        (item) =>
          `${item.equipment.brand.name} ${item.equipment.name} - ${item.quantity} шт.`,
      )
      .join(';\n');

    // Расчет общей стоимости аренды (примерно)
    const rentalDays = Math.ceil(
      (new Date(rental.endDate).getTime() -
        new Date(rental.startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const rentalCost = rental.totalAmount * rentalDays;

    // Создание документа
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1000,
                right: 1000,
                bottom: 1000,
                left: 1000,
              },
            },
          },
          children: [
            // Шапка договора
            new Paragraph({
              children: [
                new TextRun({
                  text: 'ДОГОВОР АРЕНДЫ ФОТО- И ВИДЕОТЕХНИКИ',
                  bold: true,
                  size: 28,
                  font: 'Times New Roman',
                }),
              ],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),

            // Город и дата
            new Paragraph({
              text: `г. Казань\t\t\t${formatDate(new Date())}`,
              alignment: AlignmentType.RIGHT,
              spacing: { after: 400 },
            }),

            // Стороны договора
            new Paragraph({
              text: 'ООО "Cinema Rental Store", именуемый в рамках соглашения "Арендодатель", с одной стороны, и',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: `${rental.user.customer.lastName} ${rental.user.customer.firstName} ${rental.user.customer.secondName}, именуемый в рамках соглашения "Арендатор", с другой стороны,`,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'заключили настоящий договор о нижеследующем:',
              spacing: { after: 400 },
            }),

            // 1. Предмет договора
            new Paragraph({
              children: [
                new TextRun({
                  text: '1. Предмет договора',
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
              spacing: { after: 200 },
            }),

            new Paragraph({
              text: '1.1. В рамках заключаемого договора Арендодатель сдает Арендатору фототехнику во временное пользование;',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '1.2. Сдача оборудования для фото в аренду осуществляется путем его передачи Арендатору на определенный соглашением срок;',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '1.3. Фототехника, сдаваемая во временное пользование, включает в себя следующее оборудование:',
              spacing: { after: 100 },
            }),

            // Список оборудования
            ...equipmentList.split('\n').map(
              (item) =>
                new Paragraph({
                  text: item,
                  indent: { left: 500 },
                  spacing: { after: 50 },
                }),
            ),

            new Paragraph({
              text: '1.4. Арендатор оплачивает предоставление ему техники для фото во временное пользование в соответствии с условиями настоящего соглашения;',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: `1.5. Срок аренды составляет ${rentalDays} дней, с ${formatDate(
                new Date(rental.startDate),
              )} по ${formatDate(
                new Date(rental.endDate),
              )}, и может продляться по договоренности с Арендодателем.`,
              spacing: { after: 400 },
            }),

            // 2. Стоимость аренды
            new Paragraph({
              children: [
                new TextRun({
                  text: '2. Стоимость аренды',
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
              spacing: { after: 200 },
            }),

            new Paragraph({
              text: `2.1. Стоимость предоставления указанной фототехники в аренду составляет ${rentalCost} рублей (${rental.totalAmount} руб./сутки);`,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '2.2. Оплата осуществляется путем денежного перевода на банковский счет Арендодателя, либо в наличном виде в момент заключения акта приема-передачи.',
              spacing: { after: 400 },
            }),

            // 3. Права и обязанности
            new Paragraph({
              children: [
                new TextRun({
                  text: '3. Права и обязанности сторон',
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: '3.1. Арендодатель вправе:',
                  bold: true,
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '- Требовать передачи денежных средств за пользование Арендатором фототехники;',
              indent: { left: 500 },
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: '- Требовать возмещения ущерба в случае его нанесения Арендатором.',
              indent: { left: 500 },
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: '3.2. Арендодатель обязуется:',
                  bold: true,
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '- Передать во временное пользование оборудование, указанное в тексте настоящего соглашения на определенный договором срок;',
              indent: { left: 500 },
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: '- Ознакомить Арендатора с требованиями к эксплуатации оборудования.',
              indent: { left: 500 },
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: '3.3. Арендатор вправе:',
                  bold: true,
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '- Требовать предоставления фототехники во временное пользование после передачи арендной платы в адрес Арендодателя.',
              indent: { left: 500 },
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: '3.4. Арендатор обязуется:',
                  bold: true,
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '- Использовать переданное ему оборудование исключительно в рамках его целевого назначения;',
              indent: { left: 500 },
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: '- Бережно относиться к фототехнике, переданной во временное пользование;',
              indent: { left: 500 },
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: '- Оплатить аренду оборудования в соответствии с условиями, прописанными в настоящем договоре;',
              indent: { left: 500 },
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: '- Нести ответственность в случае нанесения ущерба оборудованию, в соответствии с оценкой имущества Арендодателем.',
              indent: { left: 500 },
              spacing: { after: 400 },
            }),

            // 4. Подписи сторон
            new Paragraph({
              children: [
                new TextRun({
                  text: '4. Подписи сторон',
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
              spacing: { after: 200 },
            }),

            new Table({
              columnWidths: [50, 50],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          text: 'Арендодатель:',
                          spacing: { after: 200 },
                        }),
                        new Paragraph({
                          text: 'ООО "Cinema Rental Store"',
                          spacing: { after: 200 },
                        }),
                        new Paragraph({
                          text: '___________________________',
                          spacing: { after: 100 },
                        }),
                        new Paragraph({
                          text: 'М.П.',
                          spacing: { after: 100 },
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          text: 'Арендатор:',
                          spacing: { after: 200 },
                        }),
                        new Paragraph({
                          text: `${rental.user.customer.lastName} ${rental.user.customer.firstName} ${rental.user.customer.secondName}`,
                          spacing: { after: 200 },
                        }),
                        new Paragraph({
                          text: '___________________________',
                          spacing: { after: 100 },
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),

            // QR-код для оплаты
            new Paragraph({
              children: [
                new TextRun({
                  text: 'QR-код для оплаты:',
                  bold: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              children: [qrImage],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),

            // Контактная информация
            new Paragraph({
              text: 'Контактная информация Арендодателя:',
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Телефон: +7 (123) 456-78-90',
              alignment: AlignmentType.CENTER,
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: 'Email: info@cinemarentalstore.com',
              alignment: AlignmentType.CENTER,
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: 'Адрес: г. Казань, ул. Примерная, д. 123',
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),

            // Заключительный текст
            new Paragraph({
              text: 'Спасибо за сотрудничество!',
              alignment: AlignmentType.CENTER,
              spacing: { before: 400 },
            }),
          ],
        },
      ],
    });

    // Генерация и отправка документа
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
