import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import {
  CategoryCreate,
  CategoryResponse,
  CategoryUpdate,
} from 'src/dto/categories.dto';
import { CategoryService } from 'src/services/categories.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(
    @Body() categoryDto: CategoryCreate,
    @Headers('access_token') access_token?: string,
  ): Promise<ApiResponse<CategoryResponse>> {
    return await this.categoryService.create(categoryDto, access_token);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<
    ApiResponse<{
      data: CategoryResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    return this.categoryService.findAll(page, limit);
  }

  @Get('/byid/:id')
  findById(@Param('id') id: string): Promise<ApiResponse<CategoryResponse>> {
    return this.categoryService.findById(id);
  }

  @Get('/byname/:name')
  findByName(
    @Param('name') name: string,
  ): Promise<ApiResponse<CategoryResponse[]>> {
    return this.categoryService.findByName(name);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() category: CategoryUpdate,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<CategoryResponse>> {
    return this.categoryService.update(id, category, access_token);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<CategoryResponse>> {
    return this.categoryService.delete(id, access_token);
  }
}
