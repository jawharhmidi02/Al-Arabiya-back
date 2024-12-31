import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Headers,
  Query,
} from '@nestjs/common';
import { AdminService } from '../services/admins.service';
import { UsersUpdate, UsersResponse } from 'src/dto/users.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import {
  CategoryCreate,
  CategoryResponse,
  CategoryUpdate,
} from 'src/dto/categories.dto';
import { BrandCreate, BrandResponse, BrandUpdate } from 'src/dto/brands.dto';
import {
  ProductCreate,
  ProductResponse,
  ProductUpdate,
} from 'src/dto/products.dto';
import { OrderCreate, OrderResponse, OrderUpdate } from 'src/dto/orders.dto';
import {
  SpecialOfferCreate,
  SpecialOfferResponse,
  SpecialOfferUpdate,
} from 'src/dto/specialOffers.dto';

@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /* ADMIN PROFILE */

  @Post('/signin/')
  async SignIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<ApiResponse<{ access_token: string }>> {
    return await this.adminService.signin(email, password);
  }

  @Get('/account')
  async getAccount(
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<UsersResponse>> {
    return await this.adminService.getAccount(access_token);
  }

  @Post('/recoverpass/:email')
  async sendRecoverPass(
    @Param('email') email: string,
  ): Promise<ApiResponse<any>> {
    return await this.adminService.sendRecoverPassViaEmail(email.toLowerCase());
  }

  @Post('/changepassfromrecover/:password')
  async changePasswordFromRecover(
    @Query('access_token') access_token: string,
    @Param('password') password: string,
  ): Promise<ApiResponse<UsersResponse>> {
    return await this.adminService.changePasswordFromRecover(
      access_token,
      password,
    );
  }

  @Get('/recoverhtml')
  async getRecoverPassHtml(
    @Query('access_token') access_token: string,
  ): Promise<string> {
    return await this.adminService.recoverPageHtml(access_token);
  }

  /* USER ENDPOINTS */

  @Get('/user')
  async findAllUser(
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<UsersResponse[]>> {
    return await this.adminService.findAllUser(access_token);
  }

  @Get('/user/byid/:id')
  async findByIdUser(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<UsersResponse>> {
    return await this.adminService.findByIdUser(id, access_token);
  }

  @Put('/user/:id')
  async updateUser(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
    @Body() user: UsersUpdate,
  ): Promise<ApiResponse<UsersResponse>> {
    return await this.adminService.updateUser(id, user, access_token);
  }

  @Delete('/user/:id')
  async deleteUser(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<UsersResponse>> {
    return await this.adminService.deleteUser(id, access_token);
  }

  /* CATEGORY ENDPOINTS */

  @Post('/category')
  async createCategory(
    @Body() categoryDto: CategoryCreate,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<CategoryResponse>> {
    return await this.adminService.createCategory(categoryDto, access_token);
  }

  @Get('/category')
  async findAllCategory(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Headers('access_token') access_token: string,
  ): Promise<
    ApiResponse<{
      data: CategoryResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    return await this.adminService.findAllCategory(page, limit, access_token);
  }

  @Get('/category/byid/:id')
  async findByIdCategory(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<CategoryResponse>> {
    return await this.adminService.findByIdCategory(id, access_token);
  }

  @Get('/category/byname/:name')
  async findByNameCategory(
    @Param('name') name: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<CategoryResponse[]>> {
    return await this.adminService.findByNameCategory(name, access_token);
  }

  @Put('/category/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() category: CategoryUpdate,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<CategoryResponse>> {
    return await this.adminService.updateCategory(id, category, access_token);
  }

  @Delete('/category/:id')
  async deleteCategory(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<CategoryResponse>> {
    return await this.adminService.deleteCategory(id, access_token);
  }

  /* BRAND ENDPOINTS */

  @Post('/brand')
  async createBrand(
    @Body() brandDto: BrandCreate,
    @Headers('access_token') access_token?: string,
  ): Promise<ApiResponse<BrandResponse>> {
    return await this.adminService.createBrand(brandDto, access_token);
  }

  @Get('/brand')
  async findAllBrand(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Headers('access_token') access_token: string,
  ): Promise<
    ApiResponse<{
      data: BrandResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    return await this.adminService.findAllBrand(page, limit, access_token);
  }

  @Get('/brand/byid/:id')
  async findByIdBrand(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<BrandResponse>> {
    return await this.adminService.findByIdBrand(id, access_token);
  }

  @Get('/brand/byname/:name')
  async findByNameBrand(
    @Param('name') name: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<BrandResponse[]>> {
    return await this.adminService.findByNameBrand(name, access_token);
  }

  @Put('/brand/:id')
  async updateBrand(
    @Param('id') id: string,
    @Body() brand: BrandUpdate,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<BrandResponse>> {
    return await this.adminService.updateBrand(id, brand, access_token);
  }

  @Delete('/brand/:id')
  async deleteBrand(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<BrandResponse>> {
    return await this.adminService.deleteBrand(id, access_token);
  }

  /* PRODUCT ENDPOINTS  */

  @Post('/product')
  async createProduct(
    @Body() productDto: ProductCreate,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<ProductResponse>> {
    return await this.adminService.createProduct(productDto, access_token);
  }

  @Post('/product/list')
  async createByListProduct(
    @Body() productDto: any,
    @Headers('access_token') access_token?: string,
  ): Promise<ApiResponse<ProductResponse[]>> {
    return await this.adminService.createByListProduct(
      productDto,
      access_token,
    );
  }

  @Get('/product')
  async findAllProduct(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Headers('access_token') access_token: string,
  ): Promise<
    ApiResponse<{
      data: ProductResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    return await this.adminService.findAllProduct(page, limit, access_token);
  }

  @Get('/product/byid/:id')
  async findByIdProduct(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<ProductResponse>> {
    return await this.adminService.findByIdProduct(id, access_token);
  }

  @Get('/product/byname/:name')
  async findByNameProduct(
    @Param('name') name: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<ProductResponse[]>> {
    return await this.adminService.findByNameProduct(name, access_token);
  }

  @Get('/product/mostpopular')
  async findMostPopularProduct(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Headers('access_token') access_token: string,
  ): Promise<
    ApiResponse<{
      data: ProductResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    return await this.adminService.findMostPopularProduct(
      page,
      limit,
      access_token,
    );
  }

  @Get('/product/search')
  async searchProduct(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: 'date' | 'alpha' | 'price' = 'date',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Headers('access_token') access_token: string,
    @Query('name') name?: string,
    @Query('categories') categories?: string,
    @Query('brand') brand?: string,
    @Query('min_price') min_price?: number,
    @Query('max_price') max_price?: number,
  ): Promise<
    ApiResponse<{
      data: ProductResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    return await this.adminService.searchProduct(
      page,
      limit,
      sortBy,
      sortOrder,
      {
        name,
        categories,
        brand,
        min_price,
        max_price,
      },
      access_token,
    );
  }

  @Put('/product/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() product: ProductUpdate,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<ProductResponse>> {
    return await this.adminService.updateProduct(id, product, access_token);
  }

  @Delete('/product/:id')
  async deleteProduct(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<ProductResponse>> {
    return await this.adminService.deleteProduct(id, access_token);
  }

  /* ORDER ENDPOINTS */

  @Post('/order')
  async createOrder(
    @Body() orderDto: OrderCreate,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<OrderResponse>> {
    return await this.adminService.createOrder(orderDto, access_token);
  }

  @Get('/order')
  async findAllOrder(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Headers('access_token') access_token: string,
  ): Promise<
    ApiResponse<{
      data: OrderResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    return await this.adminService.findAllOrder(page, limit, access_token);
  }

  @Get('/order/byid/:id')
  async findByIdOrder(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<OrderResponse>> {
    return await this.adminService.findByIdOrder(id, access_token);
  }

  @Put('/order/:id')
  async updateOrder(
    @Param('id') id: string,
    @Body() order: OrderUpdate,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<OrderResponse>> {
    return await this.adminService.updateOrder(id, order, access_token);
  }

  @Delete('/order/:id')
  async deleteOrder(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<OrderResponse>> {
    return await this.adminService.deleteOrder(id, access_token);
  }

  /* SPECIALOFFER ENDPOINTS */

  @Post('/specialOffer')
  async createSpecialOffer(
    @Body() specialOfferDto: SpecialOfferCreate,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
    return await this.adminService.createSpecialOffer(
      specialOfferDto,
      access_token,
    );
  }

  @Get('/specialOffer')
  async findAllSpecialOffer(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Headers('access_token') access_token: string,
  ): Promise<
    ApiResponse<{
      data: SpecialOfferResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    return await this.adminService.findAllSpecialOffer(
      page,
      limit,
      access_token,
    );
  }

  @Get('/specialOffer/byid/:id')
  async findByIdSpecialOffer(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
    return await this.adminService.findByIdSpecialOffer(id, access_token);
  }

  @Put('/specialOffer/:id')
  async updateSpecialOffer(
    @Param('id') id: string,
    @Body() specialOffer: SpecialOfferUpdate,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
    return await this.adminService.updateSpecialOffer(
      id,
      specialOffer,
      access_token,
    );
  }

  @Delete('/specialOffer/:id')
  async deleteSpecialOffer(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
    return await this.adminService.deleteSpecialOffer(id, access_token);
  }
}
