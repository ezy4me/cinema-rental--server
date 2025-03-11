import { DatabaseService } from '@database/database.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { CartService } from '@cart/cart.service';
import { CustomerService } from 'src/customer/customer.service';
import { SmtpService } from 'src/smtp/smtp.service';

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cartService: CartService,
    private readonly customerService: CustomerService,
    private readonly smtpService: SmtpService,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.databaseService.user.findFirst({
      where: { email },
    });
  }

  async create(
    email: string,
    password: string,
    role?: string,
  ): Promise<User | undefined> {
    const _user = await this.findOne(email);

    if (_user) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const userRole = role !== undefined ? role : 'USER';

    const newUser = await this.databaseService.user.create({
      data: {
        email,
        password: this.hashPassword(password),
        role: userRole,
      },
    });

    if (newUser.role === 'USER') {
      await this.cartService.create(newUser.id);
      await this.customerService.create({
        firstName: '',
        secondName: '',
        lastName: '',
        phone: '',
        userId: newUser.id,
      });
    }

    return newUser;
  }

  async deleteUser(userId: number): Promise<{ message: string }> {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    await this.databaseService.user.delete({
      where: { id: userId },
    });

    await this.smtpService.sendMail(
      user.email,
      'Ваша учетная запись удалена',
      `Уважаемый пользователь,\n\nВаша учетная запись была удалена администратором. Если у вас есть вопросы, свяжитесь с поддержкой.\n\nС уважением,\nКоманда Cinema Rental Studio`,
    );

    return { message: 'User deleted successfully' };
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(2));
  }
}
