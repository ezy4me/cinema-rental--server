import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CartEquipmentService } from './cart-equipment.service';
import { CartEquipment } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@common/decorators';

@ApiTags('cart')
@Controller('cart/equipment')
export class CartEquipmentController {
  constructor(private readonly cartEquipmentService: CartEquipmentService) {}

  @Public()
  @Get(':cartId')
  async findAllByCartId(
    @Param('cartId', ParseIntPipe) cartId: number,
  ): Promise<CartEquipment[]> {
    return this.cartEquipmentService.findAllByCartId(cartId);
  }

  @Post(':cartId/:equipmentId')
  async addEquipmentToCart(
    @Param('cartId', ParseIntPipe) cartId: number,
    @Param('equipmentId', ParseIntPipe) equipmentId: number,
  ): Promise<CartEquipment> {
    return this.cartEquipmentService.addEquipmentToCart(cartId, equipmentId);
  }

  @Put(':cartId/:equipmentId')
  async updateEquipmentQuantity(
    @Param('cartId', ParseIntPipe) cartId: number,
    @Param('equipmentId', ParseIntPipe) equipmentId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ): Promise<CartEquipment> {
    return this.cartEquipmentService.updateEquipmentQuantity(
      cartId,
      equipmentId,
      quantity,
    );
  }

  @Delete(':cartId/:equipmentId')
  async removeEquipmentFromCart(
    @Param('cartId', ParseIntPipe) cartId: number,
    @Param('equipmentId', ParseIntPipe) equipmentId: number,
  ): Promise<CartEquipment> {
    return this.cartEquipmentService.removeEquipmentFromCart(
      cartId,
      equipmentId,
    );
  }

  @Delete('/clear/:cartId')
  async clearCart(
    @Param('cartId', ParseIntPipe) cartId: number,
  ): Promise<boolean> {
    return this.cartEquipmentService.clearCart(cartId);
  }
}
