import { JwtService } from '@nestjs/jwt';
import { Brand } from 'src/entities/brands.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { BrandCreate, BrandResponse, BrandUpdate } from 'src/dto/brands.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { Users } from 'src/entities/users.entity';
import { Product } from 'src/entities/products.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
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

      const savedBrand = await this.brandRepository.save(category);
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
      const [response, totalItems] = await Promise.all([
        this.brandRepository
          .createQueryBuilder('brand')
          .leftJoinAndSelect('brand.products', 'product')
          .leftJoinAndSelect('product.category', 'category')
          .loadRelationCountAndMap('brand.productCount', 'brand.products')
          .orderBy('brand.name', 'ASC')
          .getMany(),
        this.brandRepository.count(),
      ]);

      if (!response) {
        throw new Error('Failed to fetch brands');
      }

      const sortedResponse = response.sort(
        (a: any, b: any) => (b.productCount || 0) - (a.productCount || 0),
      );

      const data = sortedResponse
        .slice((page - 1) * limit, page * limit)
        .map((brand) => new BrandResponse(brand));

      return {
        statusCode: HttpStatus.OK,
        message: 'Brands retrieved successfully',
        data: {
          data,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
          totalItems,
        },
      };
    } catch (error) {
      console.error('Detailed error:', {
        error: error,
        stack: error.stack,
        message: error.message,
      });

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve Brands: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string): Promise<ApiResponse<BrandResponse>> {
    try {
      const response = await this.brandRepository.findOne({
        where: { id },
        relations: ['products', 'products.category'],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Brand not found',
          data: null,
        };

      const data = new BrandResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'Brand retrieved successfully',
        data,
      };
    } catch (error) {
      console.error(error);

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
      const response = await this.brandRepository.find({
        where: { name: Like(`%${name}%`) },
        relations: ['products', 'products.category'],
      });

      const data = [];
      for (let i = 0; i < response.length; i++) {
        const category = new BrandResponse(response[i]);
        // const products = await response[i].products;
        // category.products = products;
        data.push(category);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Brand retrieved successfully',
        data,
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

      await this.brandRepository.update({ id }, category);

      const response = await this.brandRepository.findOne({
        where: { id },
        relations: ['products', 'products.category'],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Brand not found',
          data: null,
        };

      const data = new BrandResponse(response);
      // const products = await response.products;
      // data.products = products;

      return {
        statusCode: HttpStatus.OK,
        message: 'Brand updated successfully',
        data,
      };
    } catch (error) {
      console.error(error);

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

      const response = await this.brandRepository.findOne({
        where: { id },
        relations: ['products', 'products.category'],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Brand not found',
          data: null,
        };

      await this.brandRepository.delete(id);

      const data = new BrandResponse(response);
      // const products = await response.products;
      // data.products = products;

      return {
        statusCode: HttpStatus.OK,
        message: 'Brand deleted successfully',
        data,
      };
    } catch (error) {
      console.error(error);
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
