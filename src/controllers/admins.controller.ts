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
import {
  CustomizationCreate,
  CustomizationResponse,
  CustomizationUpdate,
} from 'src/dto/customizations.dto';

@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /* ADMIN PROFILE */

  @Post('/signin/')
  async SignIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<ApiResponse<{ admin_access_token: string }>> {
    return await this.adminService.signin(email, password);
  }

  @Get('/account')
  async getAccount(
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<UsersResponse>> {
    return await this.adminService.getAccount(admin_access_token);
  }

  @Post('/recoverpass/:email')
  async sendRecoverPass(
    @Param('email') email: string,
  ): Promise<ApiResponse<any>> {
    return await this.adminService.sendRecoverPassViaEmail(email.toLowerCase());
  }

  @Post('/changepassfromrecover/:password')
  async changePasswordFromRecover(
    @Query('admin_access_token') admin_access_token: string,
    @Param('password') password: string,
  ): Promise<ApiResponse<UsersResponse>> {
    return await this.adminService.changePasswordFromRecover(
      admin_access_token,
      password,
    );
  }

  @Get('/recoverhtml')
  async getRecoverPassHtml(
    @Query('admin_access_token') admin_access_token: string,
  ): Promise<string> {
    return await this.adminService.recoverPageHtml(admin_access_token);
  }

  /* USER ENDPOINTS */

  @Get('/user')
  async findAllUser(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: string = 'created_At',
    @Query('order') order: string = 'ASC',
    @Query('search') search: string = '',
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<
    ApiResponse<{
      data: UsersResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    return await this.adminService.findAllUser(
      page,
      limit,
      sort,
      order,
      search,
      admin_access_token,
    );
  }

  @Get('/user/byid/:id')
  async findByIdUser(
    @Param('id') id: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<UsersResponse>> {
    return await this.adminService.findByIdUser(id, admin_access_token);
  }

  @Put('/user/:id')
  async updateUser(
    @Param('id') id: string,
    @Headers('admin_access_token') admin_access_token: string,
    @Body() user: UsersUpdate,
  ): Promise<ApiResponse<UsersResponse>> {
    return await this.adminService.updateUser(id, user, admin_access_token);
  }

  @Delete('/user/:id')
  async deleteUser(
    @Param('id') id: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<UsersResponse>> {
    return await this.adminService.deleteUser(id, admin_access_token);
  }

  /* CATEGORY ENDPOINTS */

  @Post('/category')
  async createCategory(
    @Body() categoryDto: CategoryCreate,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<CategoryResponse>> {
    return await this.adminService.createCategory(
      categoryDto,
      admin_access_token,
    );
  }

  @Get('/category')
  async findAllCategory(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<
    ApiResponse<{
      data: CategoryResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    return await this.adminService.findAllCategory(
      page,
      limit,
      name,
      admin_access_token,
    );
  }

  @Get('/category/byid/:id')
  async findByIdCategory(
    @Param('id') id: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<CategoryResponse>> {
    return await this.adminService.findByIdCategory(id, admin_access_token);
  }

  @Get('/category/byname/:name')
  async findByNameCategory(
    @Param('name') name: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<CategoryResponse[]>> {
    return await this.adminService.findByNameCategory(name, admin_access_token);
  }

  @Put('/category/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() category: CategoryUpdate,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<CategoryResponse>> {
    return await this.adminService.updateCategory(
      id,
      category,
      admin_access_token,
    );
  }

  @Delete('/category/:id')
  async deleteCategory(
    @Param('id') id: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<CategoryResponse>> {
    return await this.adminService.deleteCategory(id, admin_access_token);
  }

  /* BRAND ENDPOINTS */

  @Post('/brand')
  async createBrand(
    @Body() brandDto: BrandCreate,
    @Headers('admin_access_token') admin_access_token?: string,
  ): Promise<ApiResponse<BrandResponse>> {
    return await this.adminService.createBrand(brandDto, admin_access_token);
  }

  @Get('/brand')
  async findAllBrand(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<
    ApiResponse<{
      data: BrandResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    return await this.adminService.findAllBrand(
      page,
      limit,
      name,
      admin_access_token,
    );
  }

  @Get('/brand/byid/:id')
  async findByIdBrand(
    @Param('id') id: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<BrandResponse>> {
    return await this.adminService.findByIdBrand(id, admin_access_token);
  }

  @Get('/brand/byname/:name')
  async findByNameBrand(
    @Param('name') name: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<BrandResponse[]>> {
    return await this.adminService.findByNameBrand(name, admin_access_token);
  }

  @Put('/brand/:id')
  async updateBrand(
    @Param('id') id: string,
    @Body() brand: BrandUpdate,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<BrandResponse>> {
    return await this.adminService.updateBrand(id, brand, admin_access_token);
  }

  @Delete('/brand/:id')
  async deleteBrand(
    @Param('id') id: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<BrandResponse>> {
    return await this.adminService.deleteBrand(id, admin_access_token);
  }

  /* PRODUCT ENDPOINTS  */

  @Post('/product')
  async createProduct(
    @Body() productDto: ProductCreate,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<ProductResponse>> {
    return await this.adminService.createProduct(
      productDto,
      admin_access_token,
    );
  }

  @Post('/product/list')
  async createByListProduct(
    @Body() productDto: any,
    @Headers('admin_access_token') admin_access_token?: string,
  ): Promise<ApiResponse<ProductResponse[]>> {
    return await this.adminService.createByListProduct(
      productDto,
      admin_access_token,
    );
  }

  @Get('/product')
  async findAllProduct(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<
    ApiResponse<{
      data: ProductResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    return await this.adminService.findAllProduct(
      page,
      limit,
      name,
      admin_access_token,
    );
  }

  @Get('/product/byid/:id')
  async findByIdProduct(
    @Param('id') id: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<ProductResponse>> {
    return await this.adminService.findByIdProduct(id, admin_access_token);
  }

  @Get('/product/byname/:name')
  async findByNameProduct(
    @Param('name') name: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<ProductResponse[]>> {
    return await this.adminService.findByNameProduct(name, admin_access_token);
  }

  @Get('/product/mostpopular')
  async findMostPopularProduct(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Headers('admin_access_token') admin_access_token: string,
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
      admin_access_token,
    );
  }

  @Get('/product/search')
  async searchProduct(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: 'date' | 'alpha' | 'price' = 'date',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Headers('admin_access_token') admin_access_token: string,
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
      admin_access_token,
    );
  }

  @Put('/product/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() product: ProductUpdate,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<ProductResponse>> {
    return await this.adminService.updateProduct(
      id,
      product,
      admin_access_token,
    );
  }

  @Delete('/product/:id')
  async deleteProduct(
    @Param('id') id: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<ProductResponse>> {
    return await this.adminService.deleteProduct(id, admin_access_token);
  }

  /* ORDER ENDPOINTS */

  @Post('/order')
  async createOrder(
    @Body() orderDto: OrderCreate,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<OrderResponse>> {
    return await this.adminService.createOrder(orderDto, admin_access_token);
  }

  @Get('/order')
  async findAllOrder(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: string = 'created_At',
    @Query('order') order: string = 'ASC',
    @Query('search') search: string = '',
    @Query('state') state: string = '',
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<
    ApiResponse<{
      data: OrderResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    return await this.adminService.findAllOrder(
      page,
      limit,
      sort,
      order,
      search,
      state,
      admin_access_token,
    );
  }

  @Get('/order/byid/:id')
  async findByIdOrder(
    @Param('id') id: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<OrderResponse>> {
    return await this.adminService.findByIdOrder(id, admin_access_token);
  }

  @Put('/order/:id')
  async updateOrder(
    @Param('id') id: string,
    @Body() order: OrderUpdate,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<OrderResponse>> {
    return await this.adminService.updateOrder(id, order, admin_access_token);
  }

  @Delete('/order/:id')
  async deleteOrder(
    @Param('id') id: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<OrderResponse>> {
    return await this.adminService.deleteOrder(id, admin_access_token);
  }

  /* SPECIALOFFER ENDPOINTS */

  @Post('/specialOffer')
  async createSpecialOffer(
    @Body() specialOfferDto: SpecialOfferCreate,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
    return await this.adminService.createSpecialOffer(
      specialOfferDto,
      admin_access_token,
    );
  }

  @Get('/specialOffer')
  async findAllSpecialOffer(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Headers('admin_access_token') admin_access_token: string,
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
      admin_access_token,
    );
  }

  @Get('/specialOffer/byid/:id')
  async findByIdSpecialOffer(
    @Param('id') id: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
    return await this.adminService.findByIdSpecialOffer(id, admin_access_token);
  }

  @Put('/specialOffer/:id')
  async updateSpecialOffer(
    @Param('id') id: string,
    @Body() specialOffer: SpecialOfferUpdate,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
    return await this.adminService.updateSpecialOffer(
      id,
      specialOffer,
      admin_access_token,
    );
  }

  @Delete('/specialOffer/:id')
  async deleteSpecialOffer(
    @Param('id') id: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
    return await this.adminService.deleteSpecialOffer(id, admin_access_token);
  }

  /* CUSTOMIZATION ENDPOINTS */

  @Post('/customization')
  async createCustomization(
    @Body() customizationDto: CustomizationCreate,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<CustomizationResponse>> {
    return await this.adminService.createCustomization(
      customizationDto,
      admin_access_token,
    );
  }

  @Get('/customization')
  async findCustomization(
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<CustomizationResponse>> {
    return await this.adminService.findCustomization(admin_access_token);
  }

  @Get('/customization/byid/:id')
  async findByIdCustomization(
    @Param('id') id: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<CustomizationResponse>> {
    return await this.adminService.findByIdCustomization(
      id,
      admin_access_token,
    );
  }

  @Put('/customization/:id')
  async updateCustomization(
    @Param('id') id: string,
    @Body() customization: CustomizationUpdate,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<CustomizationResponse>> {
    return await this.adminService.updateCustomization(
      id,
      customization,
      admin_access_token,
    );
  }

  @Delete('/customization/:id')
  async deleteCustomization(
    @Param('id') id: string,
    @Headers('admin_access_token') admin_access_token: string,
  ): Promise<ApiResponse<CustomizationResponse>> {
    return await this.adminService.deleteCustomization(id, admin_access_token);
  }
}
