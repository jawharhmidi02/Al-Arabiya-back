import { JwtService } from '@nestjs/jwt';
import { Customization } from 'src/entities/customizations.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  CustomizationCreate,
  CustomizationResponse,
  CustomizationUpdate,
} from 'src/dto/customizations.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class CustomizationService {
  constructor(
    @InjectRepository(Customization)
    private customizationRepository: Repository<Customization>,
    private jwtService: JwtService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async create(
    customization: CustomizationCreate,
    access_token?: string,
  ): Promise<ApiResponse<CustomizationResponse>> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token);

      const account = await this.usersRepository.findOne({
        where: { id: payLoad.id },
      });

      if (
        !account ||
        account.nonce !== payLoad.nonce ||
        account.role !== 'admin'
      ) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Unauthorized access',
          data: null,
        };
      }
      const count = await this.customizationRepository.count();
      if (count > 0) {
        throw new HttpException(
          'Customization already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const savedCustomization =
        await this.customizationRepository.save(customization);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Customization created successfully',
        data: new CustomizationResponse(savedCustomization),
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'Failed to create customization',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async find(): Promise<ApiResponse<CustomizationResponse>> {
    try {
      const response = await this.customizationRepository.find({
        relations: [
          'featuredProducts',
          'featuredProducts.category',
          'featuredProducts.brand',
          'brands',
          'categories',
        ],
      });

      if (response.length === 0)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Customization not found',
          data: null,
        };

      const data = new CustomizationResponse(response[0]);

      return {
        statusCode: HttpStatus.OK,
        message: 'Customization retrieved successfully',
        data,
      };
    } catch (error) {
      console.error(error);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve Customization',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string): Promise<ApiResponse<CustomizationResponse>> {
    try {
      const response = await this.customizationRepository.findOne({
        where: { id },
        relations: [
          'featuredProducts',
          'featuredProducts.category',
          'featuredProducts.brands',
          'brands',
          'categories',
        ],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Customization not found',
          data: null,
        };

      const data = new CustomizationResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'Customization retrieved successfully',
        data,
      };
    } catch (error) {
      console.error(error);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve Customization',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    customization: CustomizationUpdate,
    access_token: string,
  ): Promise<ApiResponse<CustomizationResponse>> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token);
      const account = await this.usersRepository.findOne({
        where: { id: payLoad.id },
      });

      if (
        !account ||
        account.nonce !== payLoad.nonce ||
        account.role !== 'admin'
      ) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Unauthorized access',
          data: null,
        };
      }

      await this.customizationRepository.update({ id }, customization);

      const response = await this.customizationRepository.findOne({
        where: { id },
        relations: [
          'featuredProducts',
          'featuredProducts.category',
          'featuredProducts.brands',
          'brands',
          'categories',
        ],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Customization not found',
          data: null,
        };

      const data = new CustomizationResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'Customization updated successfully',
        data,
      };
    } catch (error) {
      console.error(error);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to Update Customization',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(
    id: string,
    access_token: string,
  ): Promise<ApiResponse<CustomizationResponse>> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token);
      const account = await this.usersRepository.findOne({
        where: { id: payLoad.id },
      });

      if (
        !account ||
        account.nonce !== payLoad.nonce ||
        account.role !== 'admin'
      ) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Unauthorized access',
          data: null,
        };
      }

      const response = await this.customizationRepository.findOne({
        where: { id },
        relations: [
          'featuredProducts',
          'featuredProducts.category',
          'featuredProducts.brands',
          'brands',
          'categories',
        ],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Customization not found',
          data: null,
        };

      await this.customizationRepository.delete(id);

      const data = new CustomizationResponse(response);
      // const products = await response.products;
      // data.products = products;

      return {
        statusCode: HttpStatus.OK,
        message: 'Customization deleted successfully',
        data,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to Delete Customization',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
