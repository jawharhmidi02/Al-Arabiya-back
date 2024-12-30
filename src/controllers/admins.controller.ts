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
import { UsersUpdate, UsersCreate, UsersResponse } from 'src/dto/users.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';

@Controller('admins')
export class AdminController {
  constructor(private readonly userService: AdminService) {}

  @Post('/signup/')
  signUp(@Body() user: UsersCreate): Promise<ApiResponse<UsersResponse>> {
    return this.userService.signup(user);
  }

  @Post('/signin/')
  SignIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<ApiResponse<{ access_token: string }>> {
    return this.userService.signin(email, password);
  }

  @Get()
  findAll(
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<UsersResponse[]>> {
    return this.userService.findAll(access_token);
  }

  @Get('/byid/:id')
  findById(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<UsersResponse>> {
    return this.userService.findById(id, access_token);
  }

  @Get('/account')
  getAccount(
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<UsersResponse>> {
    return this.userService.getAccount(access_token);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
    @Body() user: UsersUpdate,
  ): Promise<ApiResponse<UsersResponse>> {
    return this.userService.update(id, user, access_token);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<UsersResponse>> {
    return this.userService.remove(id, access_token);
  }

  @Post('/recoverpass/:email')
  sendRecoverPass(@Param('email') email: string): Promise<ApiResponse<any>> {
    return this.userService.sendRecoverPassViaEmail(email.toLowerCase());
  }

  @Post('/changepassfromrecover/:password')
  changePasswordFromRecover(
    @Query('access_token') access_token: string,
    @Param('password') password: string,
  ): Promise<ApiResponse<UsersResponse>> {
    return this.userService.changePasswordFromRecover(access_token, password);
  }

  @Get('/recoverhtml')
  getRecoverPassHtml(
    @Query('access_token') access_token: string,
  ): Promise<string> {
    return this.userService.recoverPageHtml(access_token);
  }
}
