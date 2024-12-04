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
  BrandCreate,
  BrandResponse,
  BrandUpdate,
} from 'src/dto/brands.dto';
import { BrandService } from 'src/services/brands.service';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  async create(
    @Body() brandDto: BrandCreate,
    @Headers('access_token') access_token?: string,
  ): Promise<ApiResponse<BrandResponse>> {
    return await this.brandService.create(brandDto, access_token);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<
    ApiResponse<{
      data: BrandResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    return this.brandService.findAll(page, limit);
  }

  @Get('/byid/:id')
  findById(@Param('id') id: string): Promise<ApiResponse<BrandResponse>> {
    return this.brandService.findById(id);
  }

  @Get('/byname/:name')
  findByName(
    @Param('name') name: string,
  ): Promise<ApiResponse<BrandResponse[]>> {
    return this.brandService.findByName(name);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() brand: BrandUpdate,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<BrandResponse>> {
    return this.brandService.update(id, brand, access_token);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<BrandResponse>> {
    return this.brandService.delete(id, access_token);
  }
}
