import { JwtService } from '@nestjs/jwt';
import { SpecialOffer } from 'src/entities/specialOffers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import {
  SpecialOfferCreate,
  SpecialOfferResponse,
  SpecialOfferUpdate,
} from 'src/dto/specialOffers.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class SpecialOfferService {
  constructor(
    @InjectRepository(SpecialOffer)
    private specialOfferRepository: Repository<SpecialOffer>,
    private jwtService: JwtService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async create(
    specialOffer: SpecialOfferCreate,
    access_token: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
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

      const savedSpecialOffer =
        await this.specialOfferRepository.save(specialOffer);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'SpecialOffer created successfully',
        data: new SpecialOfferResponse(savedSpecialOffer),
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'Failed to create SpecialOffer',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<
    ApiResponse<{
      data: SpecialOfferResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    try {
      const [response, totalItems] =
        await this.specialOfferRepository.findAndCount({
          skip: (page - 1) * limit,
          take: limit,
        });

      const data = response.map((item) => new SpecialOfferResponse(item));

      return {
        statusCode: HttpStatus.OK,
        message: 'SpecialOffers retrieved successfully',
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
          message: error.message || 'Failed to retrieve SpecialOffers',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string): Promise<ApiResponse<SpecialOfferResponse>> {
    try {
      const response = await this.specialOfferRepository.findOne({
        where: { id },
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'SpecialOffer not found',
          data: null,
        };

      const data = new SpecialOfferResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'SpecialOffer retrieved successfully',
        data,
      };
    } catch (error) {
      console.error(error);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve SpecialOffer',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    specialOffer: SpecialOfferUpdate,
    access_token: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
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

      await this.specialOfferRepository.update({ id }, specialOffer);

      const response = await this.specialOfferRepository.findOne({
        where: { id },
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'SpecialOffer not found',
          data: null,
        };

      const data = new SpecialOfferResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'SpecialOffer updated successfully',
        data,
      };
    } catch (error) {
      console.error(error);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to Update SpecialOffer',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(
    id: string,
    access_token: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
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

      const response = await this.specialOfferRepository.findOne({
        where: { id },
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'SpecialOffer not found',
          data: null,
        };

      await this.specialOfferRepository.delete(id);

      const data = new SpecialOfferResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'SpecialOffer deleted successfully',
        data,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to Delete SpecialOffer',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
