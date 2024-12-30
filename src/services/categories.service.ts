import { JwtService } from '@nestjs/jwt';
import { Category } from 'src/entities/categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import {
  CategoryCreate,
  CategoryResponse,
  CategoryUpdate,
} from 'src/dto/categories.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private jwtService: JwtService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async create(
    category: CategoryCreate,
    access_token?: string,
  ): Promise<ApiResponse<CategoryResponse>> {
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

      const savedCategory = await this.categoryRepository.save(category);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Category created successfully',
        data: new CategoryResponse(savedCategory),
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
      data: CategoryResponse[];
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
          relations: ['products', 'products.brand'],
        },
      );

      const data = [];
      for (let i = 0; i < response.length; i++) {
        const category = new CategoryResponse(response[i]);
        // const products = await response[i].products;
        // category.products = products;
        data.push(category);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Categories retrieved successfully',
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
          message: error.message || 'Failed to retrieve Categories',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string): Promise<ApiResponse<CategoryResponse>> {
    try {
      const response = await this.categoryRepository.findOne({
        where: { id },
        relations: ['products', 'products.brand'],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Category not found',
          data: null,
        };

      const data = new CategoryResponse(response);
      // const products = await response.products;
      // data.products = products;

      return {
        statusCode: HttpStatus.OK,
        message: 'Category retrieved successfully',
        data,
      };
    } catch (error) {
      console.error(error);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve Category',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByName(name: string): Promise<ApiResponse<CategoryResponse[]>> {
    try {
      const response = await this.categoryRepository.find({
        where: { name: Like(`%${name}%`) },
        relations: ['products', 'products.brand'],
      });

      const data = [];
      for (let i = 0; i < response.length; i++) {
        const category = new CategoryResponse(response[i]);
        // const products = await response[i].products;
        // category.products = products;
        data.push(category);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Category retrieved successfully',
        data,
      };
    } catch (error) {
      console.error(error);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve Categories',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    category: CategoryUpdate,
    access_token: string,
  ): Promise<ApiResponse<CategoryResponse>> {
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
        relations: ['products', 'products.brand'],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Category not found',
          data: null,
        };

      const data = new CategoryResponse(response);
      // const products = await response.products;
      // data.products = products;

      return {
        statusCode: HttpStatus.OK,
        message: 'Category updated successfully',
        data,
      };
    } catch (error) {
      console.error(error);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to Update Category',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(
    id: string,
    access_token: string,
  ): Promise<ApiResponse<CategoryResponse>> {
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
        relations: ['products', 'products.brand'],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Category not found',
          data: null,
        };

      await this.categoryRepository.delete(id);

      const data = new CategoryResponse(response);
      // const products = await response.products;
      // data.products = products;

      return {
        statusCode: HttpStatus.OK,
        message: 'Category deleted successfully',
        data,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to Delete Category',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
