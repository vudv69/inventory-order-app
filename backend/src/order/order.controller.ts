import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/utils/auth.constants';
import { UserRole } from 'src/utils/constants';
import { OrderService } from './order.service';
import { OrderCreateDto, OrderUpdateDto } from './order.dto';

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@Controller({ path: 'orders', version: '1' })
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Get()
  async list(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  async create(@Body() body: OrderCreateDto) {
    return this.service.createOrder(body);
  }

  @Put(':id')
  @Roles(UserRole.WarehouseStaff, UserRole.Manager)
  async update(@Param('id') id: string, @Body() body: OrderUpdateDto) {
    return this.service.updateOrder(id, body);
  }
}
