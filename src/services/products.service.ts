import { JwtService } from '@nestjs/jwt';
import { Product } from 'src/entities/products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import {
  ProductCreate,
  ProductResponse,
  ProductUpdate,
} from 'src/dto/products.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private jwtService: JwtService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async create(
    product: ProductCreate,
    access_token?: string,
  ): Promise<ApiResponse<ProductResponse>> {
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

      const savedProduct = await this.productRepository.save(product);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Product created successfully',
        data: new ProductResponse(savedProduct),
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'Failed to create product',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createByList(
    product: any,
    access_token?: string,
  ): Promise<ApiResponse<ProductResponse[]>> {
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

      const savedProduct = [];
      for (let i = 0; i < product.length; i++) {
        const element = await this.productRepository.save(product[i]);
        savedProduct.push(new ProductResponse(element));
      }

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Product created successfully',

        data: savedProduct,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'Failed to create product',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<
    ApiResponse<{
      data: ProductResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    try {
      const [response, totalItems] = await this.productRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        relations: ['category', 'brand'],
      });

      const data = response.map((item) => new ProductResponse(item));

      return {
        statusCode: HttpStatus.OK,
        message: 'Products retrieved successfully',
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
          message: error.message || 'Failed to retrieve Products',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string): Promise<ApiResponse<ProductResponse>> {
    try {
      const response = await this.productRepository.findOne({
        where: { id },
        relations: ['category', 'brand'],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product not found',
          data: null,
        };

      const data = new ProductResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'Product retrieved successfully',
        data,
      };
    } catch (error) {
      console.error(error);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve Product',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByName(name: string): Promise<ApiResponse<ProductResponse[]>> {
    try {
      const response = await this.productRepository.find({
        where: { name: Like(`%${name}%`) },
        relations: ['category', 'brand'],
      });

      const data = response.map((item) => new ProductResponse(item));

      return {
        statusCode: HttpStatus.OK,
        message: 'Product retrieved successfully',
        data,
      };
    } catch (error) {
      console.error(error);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve Products',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findMostPopular(
    page: number = 1,
    limit: number = 10,
  ): Promise<
    ApiResponse<{
      data: ProductResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    try {
      const [products, totalItems] = await this.productRepository.findAndCount({
        relations: ['category', 'brand', 'orderProducts'],
      });

      const sortedProducts = products
        .map((product) => ({
          ...product,
          orderProductsCount: product.orderProducts.length,
        }))
        .sort((a, b) => b.orderProductsCount - a.orderProductsCount)
        .slice((page - 1) * limit, page * limit);

      const data = sortedProducts.map((item) => new ProductResponse(item));

      return {
        statusCode: HttpStatus.OK,
        message: 'Most Popular Products retrieved successfully',
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
          message: error.message || 'Failed to retrieve Most Popular Products',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async search(
    page: number = 1,
    limit: number = 10,
    sortBy: 'date' | 'alpha' | 'price' = 'date',
    sortOrder: 'asc' | 'desc' = 'desc',
    filters: {
      name?: string;
      categories?: string;
      brand?: string;
      min_price?: number;
      max_price?: number;
    },
  ): Promise<
    ApiResponse<{
      data: ProductResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    try {
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      queryBuilder.leftJoinAndSelect('product.category', 'category');
      queryBuilder.leftJoinAndSelect('product.brand', 'brand');
      queryBuilder.skip((page - 1) * limit).take(limit);

      if (filters.name) {
        queryBuilder.andWhere('LOWER(product.name) LIKE :name', {
          name: `%${filters.name.toLowerCase()}%`,
        });
      }

      if (filters.brand) {
        queryBuilder.andWhere('LOWER(brand.name) LIKE :brand', {
          brand: `%${filters.brand.toLowerCase()}%`,
        });
      }

      if (filters.categories) {
        const categoryList = decodeURIComponent(filters.categories).split(',');
        queryBuilder.andWhere('category.name IN (:...categories)', {
          categories: categoryList,
        });
      }

      if (filters.min_price !== undefined) {
        queryBuilder.andWhere('product.normalSinglePrice >= :min_price', {
          min_price: filters.min_price,
        });
      }

      if (filters.max_price !== undefined) {
        queryBuilder.andWhere('product.normalSinglePrice <= :max_price', {
          max_price: filters.max_price,
        });
      }

      const order: 'ASC' | 'DESC' = sortOrder === 'asc' ? 'ASC' : 'DESC';
      if (sortBy === 'date') {
        queryBuilder.orderBy('product.created_At', order);
      } else if (sortBy === 'alpha') {
        queryBuilder.orderBy('product.name', order);
      } else if (sortBy === 'price') {
        queryBuilder.orderBy('product.normalSinglePrice', order);
      }

      const [products, totalItems] = await queryBuilder.getManyAndCount();

      const data = products.map((product) => new ProductResponse(product));

      const totalPages = Math.ceil(totalItems / limit);

      return {
        statusCode: HttpStatus.OK,
        message: 'Products retrieved successfully',
        data: {
          data,
          totalPages,
          currentPage: page,
          totalItems,
        },
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve Products',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    product: ProductUpdate,
    access_token: string,
  ): Promise<ApiResponse<ProductResponse>> {
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

      await this.productRepository.update(id, product);

      const response = await this.productRepository.findOne({
        where: { id },
        relations: ['category', 'brand'],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product not found',
          data: null,
        };

      const data = new ProductResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'Product updated successfully',
        data,
      };
    } catch (error) {
      console.error(error);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to Update Product',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(
    id: string,
    access_token: string,
  ): Promise<ApiResponse<ProductResponse>> {
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

      const response = await this.productRepository.findOne({
        where: { id },
        relations: ['category', 'brand'],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product not found',
          data: null,
        };

      await this.productRepository.delete(id);

      const data = new ProductResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'Product deleted successfully',
        data,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to Delete Product',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
