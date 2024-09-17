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

@ApiTags('cart')
@Controller('cart/equipment')
export class CartEquipmentController {
  constructor(private readonly cartEquipmentService: CartEquipmentService) {}

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
    @Body('quantity', ParseIntPipe) quantity: number,
  ): Promise<CartEquipment> {
    return this.cartEquipmentService.addEquipmentToCart(
      cartId,
      equipmentId,
      quantity,
    );
  }

  @Put(':id')
  async updateEquipmentQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ): Promise<CartEquipment> {
    return this.cartEquipmentService.updateEquipmentQuantity(id, quantity);
  }

  @Delete(':id')
  async removeEquipmentFromCart(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CartEquipment> {
    return this.cartEquipmentService.removeEquipmentFromCart(id);
  }
}
