import { PrismaClient } from '@prisma/client';
import { createReadStream } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Current directory:', process.cwd());

  // Upsert статусов
  const statusCreated = await prisma.status.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Создан' },
  });

  const statusPaid = await prisma.status.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Оплачен' },
  });

  const statusCancelled = await prisma.status.upsert({
    where: { id: 3 },
    update: {},
    create: { name: 'Отменен' },
  });

  console.log({ statusCreated, statusPaid, statusCancelled });

  // Список файлов изображений
  const files = ['camera.jpg', 'lenses.jpg', 'light.jpg', 'stabilizers.jpg'];

  // Функция для преобразования потока в буфер
  const streamToBuffer = (stream: NodeJS.ReadableStream): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  };

  // Чтение файлов в буфер
  const fileRecords = await Promise.all(
    files.map(async (filename) => {
      const filePath = join(process.cwd(), 'public', filename); // Правильный путь к файлу
      const fileStream = createReadStream(filePath); // Создание потока чтения

      const fileData: Buffer = await streamToBuffer(fileStream); // Преобразование потока в буфер

      console.log(`File read: ${filename}, Size: ${fileData.length} bytes`);

      return {
        filename,
        mimetype: 'image/jpeg',
        data: fileData, // Хранение фактических данных буфера
      };
    }),
  );

  // Создание записей файлов в базе данных
  const createdFileRecords = await Promise.all(
    fileRecords.map((file) =>
      prisma.file.create({
        data: {
          filename: file.filename,
          mimetype: file.mimetype,
          data: file.data, // Вставка буфера в базу данных
        },
      }),
    ),
  );

  console.log('Files added:', createdFileRecords);

  // Определение категорий
  const categories = [
    {
      name: 'Камеры',
      description: 'Кинокамеры ARRI и RED для профессиональных съёмок.',
      fileId: createdFileRecords[0]?.id,
    },
    {
      name: 'Оптика',
      description:
        'Cooke, ARRI, Zeiss и Angenieux — передовые объективы для киноиндустрии.',
      fileId: createdFileRecords[1]?.id,
    },
    {
      name: 'Освещение',
      description:
        'Современные осветительные приборы для съемок, включая световые решения.',
      fileId: createdFileRecords[2]?.id,
    },
    {
      name: 'Стабилизация',
      description:
        'Системы электронной стабилизации и поддержки камер, включая DJI, Freefly и другие.',
      fileId: createdFileRecords[3]?.id,
    },
  ];

  // Upsert категорий
  for (const [index, category] of categories.entries()) {
    await prisma.category.upsert({
      where: { id: index + 1 },
      update: {
        name: category.name,
        description: category.description,
        fileId: category.fileId,
      },
      create: {
        name: category.name,
        description: category.description,
        fileId: category.fileId,
      },
    });
  }

  console.log('Categories added');

  // Добавление брендов
  const brands = [
    'AJA',
    'ARRI',
    'Accsoon',
    'Angenieux',
    'Apple',
    'Atlas',
    'Atomos',
    'Blackmagic Design',
    'CMotion',
    'Cooke',
    'DJI',
    'Dana Dolly',
    'Eartec',
    'Easyrig',
    'Flanders Scientific',
    'Foocus Pookus',
    'Freefly Systems',
    'Hollyland',
    'IBE OPTICS',
    'IN2CORE',
    'Inovativ',
    'Insta360',
    'Kowa',
    'Leitz',
    'Lilliput',
    'Matthews',
    'NiSi',
    'OConnor',
    'Proaim',
    'RED',
    'SONY',
    'Sachtler',
    'Schneider',
    'Sigma',
    'Swit',
    'TVlogic',
    'Tiffen',
    'Tilta',
    'Tokina',
    'Tribe7',
    'Vantage',
    'Vaxis',
    'Venus Optics',
    'Wicam',
    'Wideopen Filmtools',
    'Zeiss',
  ];

  // Upsert брендов
  for (const [index, brand] of brands.entries()) {
    await prisma.brand.upsert({
      where: { id: index + 1 },
      update: { name: brand },
      create: { name: brand },
    });
  }

  console.log('Brands added');
}

// Вызов основной функции и обработка ошибок
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
