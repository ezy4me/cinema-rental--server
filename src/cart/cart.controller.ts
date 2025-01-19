import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Cart } from '@prisma/client';
import { CartService } from './cart.service';
import { Public } from '@common/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartEquipmentService: CartService) {}

  @Public()
  @Get(':userId')
  async findAllByCartId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Cart> {
    return this.cartEquipmentService.findOneByUserId(userId);
  }
}
