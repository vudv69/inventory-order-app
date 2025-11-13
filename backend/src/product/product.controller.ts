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
import { ProductStatus } from './product.schema';
import { ProductService } from './product.service';

@ApiTags('Products')
@ApiBearerAuth('access-token')
@Controller({ path: 'products', version: '1' })
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1, default: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10, default: 10 })
  @ApiQuery({ name: 'filter', required: false, example: 'milk' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ProductStatus,
    example: ProductStatus.Active,
  })
  @ApiOkResponse({ type: PaginatedProductResponseDto })
  async getProducts(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('filter') filter?: string,
    @Query('status') status?: ProductStatus,
  ): Promise<PaginatedProductResponseDto> {
    return this.service.getProducts(
      Number(page),
      Number(limit),
      filter,
      status,
    );
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
