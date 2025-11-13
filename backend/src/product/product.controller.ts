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
import { Roles } from '../utils/auth.constants';
import { UserRole } from '../utils/constants';
import {
  PaginatedProductResponseDto,
  ProductCreateDto,
  ProductResponse,
  ProductUpdateDto,
} from './product.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@ApiBearerAuth('access-token')
@Controller({ path: 'products', version: '1' })
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  @ApiQuery({ name: '_start', required: false, example: 0, default: 0 })
  @ApiQuery({ name: '_end', required: false, example: 12, default: 12 })
  @ApiOkResponse({ type: ProductResponse })
  async getProducts(
    @Query('_start') start = 0,
    @Query('_end') end = 12,
  ): Promise<ProductResponse[]> {
    return this.service.getProducts(start, end);
  }

  @Post()
  @Roles(UserRole.Manager)
  @ApiCreatedResponse({ type: ProductResponse })
  createProduct(@Body() body: ProductCreateDto) {
    return this.service.createProduct(body);
  }

  @Put(':id')
  @Roles(UserRole.Manager)
  @ApiParam({
    name: 'id',
    type: String,
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiOkResponse({ type: ProductResponse })
  updateProduct(@Param('id') id: string, @Body() body: ProductUpdateDto) {
    return this.service.updateProduct(id, body);
  }

  @Delete(':id')
  @Roles(UserRole.Manager)
  @ApiParam({
    name: 'id',
    type: String,
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  deleteProduct(@Param('id') id: string) {
    return this.service.deleteProduct(id);
  }
}
