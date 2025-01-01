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
  CustomizationCreate,
  CustomizationResponse,
  CustomizationUpdate,
} from 'src/dto/customizations.dto';
import { CustomizationService } from 'src/services/customizations.service';

@Controller('customization')
export class CustomizationController {
  constructor(private readonly customizationService: CustomizationService) {}

  @Post()
  async create(
    @Body() customizationDto: CustomizationCreate,
    @Headers('access_token') access_token?: string,
  ): Promise<ApiResponse<CustomizationResponse>> {
    return await this.customizationService.create(
      customizationDto,
      access_token,
    );
  }

  @Get()
  async find(): Promise<ApiResponse<CustomizationResponse>> {
    return await this.customizationService.find();
  }

  @Get('/byid/:id')
  async findById(
    @Param('id') id: string,
  ): Promise<ApiResponse<CustomizationResponse>> {
    return await this.customizationService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() customization: CustomizationUpdate,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<CustomizationResponse>> {
    return await this.customizationService.update(
      id,
      customization,
      access_token,
    );
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<CustomizationResponse>> {
    return await this.customizationService.delete(id, access_token);
  }
}
