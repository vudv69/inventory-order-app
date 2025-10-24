import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/utils/auth.constants';
import { UserRole } from 'src/utils/constants';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller({ path: 'products', version: '1' })
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  async getAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('filter') filter?: string,
  ) {
    return this.service.list(Number(page), Number(limit), filter);
  }

  @Post()
  @Roles(UserRole.Manager)
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Put(':id')
  @Roles(UserRole.Manager)
  update(@Param('id') id: number, @Body() body: any) {
    return this.service.update(Number(id), body);
  }

  @Delete(':id')
  @Roles(UserRole.Manager)
  remove(@Param('id') id: number) {
    return this.service.remove(Number(id));
  }
}
