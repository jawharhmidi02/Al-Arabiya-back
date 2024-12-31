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
  SpecialOfferCreate,
  SpecialOfferResponse,
  SpecialOfferUpdate,
} from 'src/dto/specialOffers.dto';
import { SpecialOfferService } from 'src/services/specialOffers.service';

@Controller('specialOffer')
export class SpecialOfferController {
  constructor(private readonly specialOfferService: SpecialOfferService) {}

  @Post()
  async create(
    @Body() specialOfferDto: SpecialOfferCreate,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
    return await this.specialOfferService.create(specialOfferDto, access_token);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<
    ApiResponse<{
      data: SpecialOfferResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    return this.specialOfferService.findAll(page, limit);
  }

  @Get('/byid/:id')
  findById(
    @Param('id') id: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
    return this.specialOfferService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() specialOffer: SpecialOfferUpdate,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
    return this.specialOfferService.update(id, specialOffer, access_token);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
    return this.specialOfferService.delete(id, access_token);
  }
}
