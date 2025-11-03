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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/utils/auth.constants';
import { UserRole } from 'src/utils/constants';
import {
  PaginatedProductResponseDto,
  ProductCreateDto,
  ProductResponseDto,
  ProductUpdateDto,
} from './product.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@ApiBearerAuth('access-token')
@Controller({ path: 'products', version: '1' })
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1, default: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10, default: 10 })
  @ApiQuery({ name: 'filter', required: false, example: '' })
  @ApiOkResponse({ type: PaginatedProductResponseDto })
  async getAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('filter') filter?: string,
  ): Promise<PaginatedProductResponseDto> {
    return this.service.list(Number(page), Number(limit), filter);
  }

  @Post()
  @Roles(UserRole.Manager)
  @ApiCreatedResponse({ type: ProductResponseDto })
  create(@Body() body: ProductCreateDto) {
    return this.service.create(body);
  }

  @Put(':id')
  @Roles(UserRole.Manager)
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: ProductResponseDto })
  update(@Param('id') id: number, @Body() body: ProductUpdateDto) {
    return this.service.update(Number(id), body);
  }

  @Delete(':id')
  @Roles(UserRole.Manager)
  @ApiParam({ name: 'id', type: Number, example: 1 })
  remove(@Param('id') id: number) {
    return this.service.remove(Number(id));
  }
}
