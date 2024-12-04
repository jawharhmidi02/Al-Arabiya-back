import { JwtService } from '@nestjs/jwt';
import { Brand } from 'src/entities/brands.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { BrandCreate, BrandResponse, BrandUpdate } from 'src/dto/brands.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private categoryRepository: Repository<Brand>,
    private jwtService: JwtService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async create(
    category: BrandCreate,
    access_token?: string,
  ): Promise<ApiResponse<BrandResponse>> {
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

      const savedBrand = await this.categoryRepository.save(category);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Brand created successfully',
        data: new BrandResponse(savedBrand),
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'Failed to create category',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<
    ApiResponse<{
      data: BrandResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    try {
      const [response, totalItems] = await this.categoryRepository.findAndCount(
        {
          skip: (page - 1) * limit,
          take: limit,
          relations: ['products'],
        },
      );

      const data = [];
      for (let i = 0; i < response.length; i++) {
        const category = new BrandResponse(response[i]);
        const products = await response[i].products;
        category.products = products;
        data.push(category);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Brands retrieved successfully',
        data: {
          data: data,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
          totalItems,
        },
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve Brands',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string): Promise<ApiResponse<BrandResponse>> {
    try {
      const response = await this.categoryRepository.findOne({
        where: { id },
        relations: ['products'],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Brand not found',
          data: null,
        };

      const data = new BrandResponse(response);
      const products = await response.products;
      data.products = products;

      return {
        statusCode: HttpStatus.OK,
        message: 'Brand retrieved successfully',
        data,
      };
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve Brand',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByName(name: string): Promise<ApiResponse<BrandResponse[]>> {
    try {
      const response = await this.categoryRepository.find({
        where: { name: Like(`%${name}%`) },
        relations: ['products'],
      });

      const data = [];
      for (let i = 0; i < response.length; i++) {
        const category = new BrandResponse(response[i]);
        const products = await response[i].products;
        category.products = products;
        data.push(category);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Brand retrieved successfully',
        data,
      };
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve Brands',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    category: BrandUpdate,
    access_token: string,
  ): Promise<ApiResponse<BrandResponse>> {
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

      await this.categoryRepository.update({ id }, category);

      const response = await this.categoryRepository.findOne({
        where: { id },
        relations: ['products'],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Brand not found',
          data: null,
        };

      const data = new BrandResponse(response);
      const products = await response.products;
      data.products = products;

      return {
        statusCode: HttpStatus.OK,
        message: 'Brand updated successfully',
        data,
      };
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to Update Brand',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(
    id: string,
    access_token: string,
  ): Promise<ApiResponse<BrandResponse>> {
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

      const response = await this.categoryRepository.findOne({
        where: { id },
        relations: ['products'],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Brand not found',
          data: null,
        };

      await this.categoryRepository.delete(id);

      const data = new BrandResponse(response);
      const products = await response.products;
      data.products = products;

      return {
        statusCode: HttpStatus.OK,
        message: 'Brand deleted successfully',
        data,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to Delete Brand',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
