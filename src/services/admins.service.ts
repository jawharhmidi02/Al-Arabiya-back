import {
  Injectable,
  HttpStatus,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, ILike, Or, Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { UsersResponse, UsersUpdate } from 'src/dto/users.dto';
import { JwtService } from '@nestjs/jwt';
import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { jwtConstants } from 'src/constants/jwt.constant';
import * as nodemailer from 'nodemailer';
import { Category } from 'src/entities/categories.entity';
import {
  CategoryCreate,
  CategoryResponse,
  CategoryUpdate,
} from 'src/dto/categories.dto';
import { Brand } from 'src/entities/brands.entity';
import { OrderProduct } from 'src/entities/orderProduct.entity';
import { Order } from 'src/entities/orders.entity';
import { Product } from 'src/entities/products.entity';
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
import { SpecialOffer } from 'src/entities/specialOffers.entity';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Customization } from 'src/entities/customizations.entity';
import {
  CustomizationCreate,
  CustomizationResponse,
  CustomizationUpdate,
} from 'src/dto/customizations.dto';
import { isUUID } from 'class-validator';

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.CRYPTO_SECRET_KEY, 'hex');
const iv = randomBytes(16);

function encrypt(text: string) {
  let cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

@Injectable()
export class AdminService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private orderProductRepository: Repository<OrderProduct>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(SpecialOffer)
    private specialOfferRepository: Repository<SpecialOffer>,
    @InjectRepository(Customization)
    private customizationRepository: Repository<Customization>,
    private jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  private async uploadToCloudinary(base64Image: string): Promise<string> {
    try {
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      const uploadResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          cloudinary.uploader.upload(
            `data:image/png;base64,${base64Data}`,
            {
              folder: 'Al-Arabiya',
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) reject(error);
              resolve(result);
            },
          );
        },
      );

      return uploadResult.secure_url;
    } catch (error) {
      throw new HttpException('Failed to upload image', HttpStatus.BAD_REQUEST);
    }
  }

  private async verifyAdmin(admin_access_token: string): Promise<Users> {
    try {
      const payload = await this.jwtService.verifyAsync(admin_access_token);
      const account = await this.usersRepository.findOne({
        where: { id: payload.id },
      });

      if (
        !account ||
        account.nonce !== payload.nonce ||
        account.role !== 'admin'
      ) {
        throw new HttpException('Unauthorized access', HttpStatus.FORBIDDEN);
      }

      return account;
    } catch (error) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /* ADMIN PROFILE */

  async signin(
    email: string,
    password: string,
  ): Promise<ApiResponse<{ admin_access_token: string }>> {
    try {
      const response = await this.usersRepository.findOne({
        where: { email: email.toLowerCase() },
      });
      if (!response || decrypt(response.password) !== password) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
          data: null,
        };
      }

      if (response.role !== 'admin') {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized access',
          data: null,
        };
      }

      const accessToken = await this.jwtService.signAsync({
        id: response.id,
        role: response.role,
        nonce: response.nonce,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Sign-in successful',
        data: { admin_access_token: accessToken },
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Signin failed',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAccount(token: string): Promise<ApiResponse<UsersResponse>> {
    try {
      const payLoad = await this.jwtService.verifyAsync(token);

      const response = await this.usersRepository.findOne({
        where: { id: payLoad.id },
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Account not found',
          data: null,
        };

      if (response.nonce !== payLoad.nonce) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid token',
          data: null,
        };
      }

      if (response.role !== 'admin') {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized access',
          data: null,
        };
      }

      const data = new UsersResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'Account retrieved successfully',
        data,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve account',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendRecoverPassViaEmail(email: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.usersRepository.findOne({
        where: { email: email.toLowerCase() },
      });
      if (!response) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Email not found',
          data: null,
        };
      }

      if (response.role !== 'admin') {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Only admins can recover password',
          data: null,
        };
      }

      const admin_access_token = await this.jwtService.signAsync(
        {
          id: response.id,
          email: email.toLowerCase(),
          nonce: response.nonce,
        },
        { expiresIn: '10m', secret: jwtConstants.secret },
      );

      const html = `
<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>استعادة كلمة المرور - العربية</title>
    <style>
        body {
            font-family: 'Ubuntu', sans-serif;
            background-color: #f7f6f1;
            color: #2f2f2f;
            margin: 0;
            padding: 20px;
            direction: rtl;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
            font-size: 2rem;
            font-weight: bold;
            color: #d99814;
        }
        .content {
            padding: 20px 0;
        }
        .content p {
            line-height: 1.8;
            margin-bottom: 20px;
        }
        .content a {
            display: inline-block;
            background-color: #d99814;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }
        .content a:hover {
            background-color: #895f0c;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">العربية</div>
        <div class="content">
            <p>مرحباً،</p>
            <p>لقد تلقينا طلباً لاستعادة كلمة المرور الخاصة بك على موقع العربية. يمكنك إعادة تعيين كلمة المرور من خلال الرابط أدناه:</p>
            <a href="${process.env.API_URL}/users/recoverhtml?admin_access_token=${admin_access_token}" target="_blank">إعادة تعيين كلمة المرور</a>
            <p>إذا لم تطلب ذلك، يمكنك تجاهل هذا البريد الإلكتروني.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 العربية. جميع الحقوق محفوظة.</p>
        </div>
    </div>
</body>
</html>
`;

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email.toLowerCase(),
        subject: 'Recover Account',
        html,
      };

      const emailResponse = await this.transporter.sendMail(mailOptions);

      if (emailResponse.accepted.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Email sent successfully',
          data: null,
        };
      } else {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to send email',
          data: null,
        };
      }
    } catch (error) {
      console.error(error);

      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to send email',
        data: null,
      };
    }
  }

  async recoverPageHtml(admin_access_token: string): Promise<string> {
    try {
      const payLoad = await this.jwtService.verifyAsync(admin_access_token, {
        secret: jwtConstants.secret,
      });

      if (payLoad.email == undefined) {
        throw new Error();
      }

      const response = await this.usersRepository.findOne({
        where: { email: payLoad.email.toLowerCase() },
      });

      if (!response || response.nonce != payLoad.nonce) {
        throw Error;
      }

      if (response.role !== 'admin') {
        return 'Only admins can recover password';
      }

      var html = `
  <!DOCTYPE html>
  <html lang="ar">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>العربية: إعادة تعيين كلمة المرور</title>
      <style>
        body {
          font-family: "Ubuntu", sans-serif;
          background-color: #f7f6f1;
          color: #2f2f2f;
          margin: 0;
          padding: 20px;
          direction: rtl;
        }
        .container {
          max-width: 400px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          font-size: 2rem;
          font-weight: bold;
          text-align: center;
          color: #d99814;
          margin-bottom: 20px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 20px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
        }
        .form-group input {
          width: calc(100% - 20px);
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .form-group button {
          width: 100%;
          padding: 10px;
          background-color: #d99814;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .form-group button:hover {
          background-color: #895f0c;
        }
        .toast {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #d99814;
          color: #fff;
          padding: 10px 20px;
          border-radius: 4px;
          display: none;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          font-size: 14px;
        }
        .toast.error {
          background-color: #e3342f;
        }
        .toast.success {
          background-color: #38c172;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">العربية</div>
        <form id="resetForm">
          <div class="form-group">
            <label for="password">كلمة المرور الجديدة</label>
            <input type="password" id="password" name="password" required />
          </div>
          <div class="form-group">
            <label for="confirmPassword">تأكيد كلمة المرور</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required />
          </div>
          <div class="form-group">
            <button type="button" id="change">تغيير كلمة المرور</button>
          </div>
        </form>
      </div>
      <div id="toast" class="toast"></div>
      <script>
        const showToast = (message, type = "success") => {
          const toast = document.getElementById("toast");
          toast.textContent = message;
          toast.className = \`toast \${type}\`;
          toast.style.display = "block";
          setTimeout(() => {
            toast.style.display = "none";
          }, 3000);
        };
  
        document.querySelector("#change").addEventListener("click", async () => {
          const password = document.querySelector("#password").value;
          const confirmPassword = document.querySelector("#confirmPassword").value;
          const admin_access_token = new URLSearchParams(window.location.search).get("admin_access_token");

          if (!password || !confirmPassword) {
            showToast("يرجى ملء جميع الحقول.", "error");
            return;
          }

          if (password !== confirmPassword) {
            showToast("كلمتا المرور غير متطابقتين.", "error");
            return;
          }

          if (password.length < 8) {
            showToast("يجب أن تكون كلمة المرور 8 أحرف على الأقل.", "error");
            return;
          }

          if (admin_access_token) {
            try {
              const response = await fetch(
                \`${process.env.API_URL}/users/changepassfromrecover/\${password}?admin_access_token=\${admin_access_token}\`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              const result = await response.json();

              if (response.ok) {
                if(result.message === 'Password changed successfully'){
                showToast("تم تغيير كلمة المرور بنجاح!", "success");
                setTimeout(() => {
                  window.location = \`${process.env.FRONT_URL}/\`;
                }, 2000);}
                else{
                  showToast("تعذر تغيير كلمة المرور. الرجاء المحاولة مرة أخرى.", "error");
              }
              } else {
                showToast("تعذر تغيير كلمة المرور. الرجاء المحاولة مرة أخرى.", "error");
              }
            } catch (error) {
              console.error(error);
              showToast("حدث خطأ. الرجاء المحاولة مرة أخرى.", "error");
            }
          } else {
            showToast("رمز التحقق غير صالح.", "error");
          }
        });

      </script>
    </body>
  </html>
  `;

      return html;
    } catch (error) {
      console.error(error);
      return `<h1>حدث خطأ أثناء معالجة طلبك</h1>`;
    }
  }

  async changePasswordFromRecover(
    admin_access_token: string,
    newPassword: string,
  ): Promise<ApiResponse<UsersResponse>> {
    try {
      const payLoad = await this.jwtService.verifyAsync(admin_access_token, {
        secret: jwtConstants.secret,
      });

      if (!payLoad.email) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid token',
          data: null,
        };
      }

      const user = await this.usersRepository.findOne({
        where: { email: payLoad.email.toLowerCase() },
      });

      if (!user) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
          data: null,
        };
      }

      if (user.role !== 'admin') {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'You are not authorized to change password',
          data: null,
        };
      }

      const currentPassword = decrypt(user.password);
      if (newPassword === currentPassword) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'New password cannot be the same as the current password',
          data: null,
        };
      }

      const newNonce = randomBytes(16).toString('hex');
      user.nonce = newNonce;
      user.password = encrypt(newPassword);

      await this.usersRepository.update(
        { email: payLoad.email.toLowerCase() },
        user,
      );

      const updatedUser = await this.usersRepository.findOne({
        where: { email: payLoad.email.toLowerCase() },
      });

      const data = new UsersResponse(updatedUser);

      return {
        statusCode: HttpStatus.OK,
        message: 'Password changed successfully',
        data,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to change password',
        data: null,
      };
    }
  }

  /* USER ENDPOINTS */

  async findAllUser(
    page: number = 1,
    limit: number = 10,
    sort: string = 'full_name',
    order: string = 'ASC',
    search: string = '',
    admin_access_token: string,
  ): Promise<
    ApiResponse<{
      data: UsersResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      const skip = (page - 1) * limit;

      const queryBuilder = this.usersRepository.createQueryBuilder('user');

      queryBuilder.where('user.id != :currentAccountId', {
        currentAccountId: account.id,
      });

      if (search) {
        const searchLower = search.toLowerCase().trim();

        const isValidUUID =
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            searchLower,
          );

        if (isValidUUID) {
          queryBuilder.where('user.id = :id', { id: searchLower });
        } else {
          queryBuilder.where(
            '(LOWER(user.full_name) LIKE :search OR LOWER(user.email) LIKE :search OR LOWER(user.phone) LIKE :search OR LOWER(user.city) LIKE :search)',
            { search: `%${searchLower}%` },
          );
        }
      }

      const allowedSortFields = ['full_name', 'email', 'created_At', 'id'];
      const sortField = allowedSortFields.includes(sort) ? sort : 'full_name';

      queryBuilder.orderBy(
        `user.${sortField}`,
        order.toUpperCase() as 'ASC' | 'DESC',
      );

      queryBuilder.skip(skip).take(limit);

      const [users, totalItems] = await queryBuilder.getManyAndCount();

      const totalPages = Math.ceil(totalItems / limit);

      const data = users.map((user) => new UsersResponse(user));

      return {
        statusCode: HttpStatus.OK,
        message: 'Users retrieved successfully',
        data: {
          data,
          totalPages,
          currentPage: page,
          totalItems,
        },
      };
    } catch (error) {
      console.error(error);

      if (error instanceof UnauthorizedException) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Unauthorized access',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (error.code === '22P02') {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid ID format',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve users',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByIdUser(
    id: string,
    admin_access_token: string,
  ): Promise<ApiResponse<UsersResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      const response = await this.usersRepository.findOne({ where: { id } });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
          data: null,
        };

      const data = new UsersResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'User retrieved successfully',
        data,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve user',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(
    id: string,
    user: UsersUpdate,
    admin_access_token: string,
  ): Promise<ApiResponse<UsersResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      if (id === account.id) {
        if (
          user.current_password &&
          user.current_password !== decrypt(account.password)
        ) {
          throw new Error('Invalid password');
        }
        delete user['current_password'];
      }

      if (user.password) {
        user.password = encrypt(user.password);
      }

      await this.usersRepository.update(id, user);

      const response = await this.usersRepository.findOne({ where: { id } });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
          data: null,
        };

      const data = new UsersResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data,
      };
    } catch (error) {
      console.error(error);
      var message: String = error.message || 'Signup Failed';
      if (message.includes('duplicate key value violates unique constraint')) {
        message = 'Email already exists';
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUser(
    id: string,
    admin_access_token: string,
  ): Promise<ApiResponse<UsersResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      const response = await this.usersRepository.findOne({ where: { id } });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
          data: null,
        };

      await this.usersRepository.delete(id);

      const data = new UsersResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
        data,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to delete user',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* CATEGORY ENDPOINTS */

  async createCategory(
    category: CategoryCreate,
    admin_access_token: string,
  ): Promise<ApiResponse<CategoryResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      const savedCategory = await this.categoryRepository.save(category);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Category created successfully',
        data: new CategoryResponse(savedCategory),
      };
    } catch (error) {
      console.error(error);
      var message: String = error.message || 'Failed';
      if (message.includes('duplicate key value violates unique constraint')) {
        message = 'Category already exists';
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllCategory(
    page: number = 1,
    limit: number = 10,
    name: string = '',
    admin_access_token: string,
  ): Promise<
    ApiResponse<{
      data: CategoryResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      const [response, totalItems] = await this.categoryRepository.findAndCount(
        {
          where: [
            { name: ILike(`%${name}%`) },
            isUUID(name) ? { id: name } : {},
          ],
          skip: (page - 1) * limit,
          take: limit,
          relations: ['products', 'products.brand'],
        },
      );

      const data = [];
      for (let i = 0; i < response.length; i++) {
        const category = new CategoryResponse(response[i]);
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

  async findByIdCategory(
    id: string,
    admin_access_token: string,
  ): Promise<ApiResponse<CategoryResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

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

  async findByNameCategory(
    name: string,
    admin_access_token: string,
  ): Promise<ApiResponse<CategoryResponse[]>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      const response = await this.categoryRepository.find({
        where: { name: ILike(`%${name}%`) },
        relations: ['products', 'products.brand'],
      });

      const data = [];
      for (let i = 0; i < response.length; i++) {
        const category = new CategoryResponse(response[i]);

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

  async updateCategory(
    id: string,
    category: CategoryUpdate,
    admin_access_token: string,
  ): Promise<ApiResponse<CategoryResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

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

      return {
        statusCode: HttpStatus.OK,
        message: 'Category updated successfully',
        data,
      };
    } catch (error) {
      console.error(error);
      var message: String = error.message || 'Signup Failed';
      if (message.includes('duplicate key value violates unique constraint')) {
        message = 'Category already exists';
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteCategory(
    id: string,
    admin_access_token: string,
  ): Promise<ApiResponse<CategoryResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

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

  /* BRAND ENDPOINTS */

  async createBrand(
    brand: BrandCreate,
    admin_access_token: string,
  ): Promise<ApiResponse<BrandResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      if (brand.img) {
        if (
          !(brand.img.startsWith('http') || brand.img.startsWith('/images/'))
        ) {
          const uploadResult = await this.uploadToCloudinary(brand.img);
          brand.img = uploadResult;
        }
      }

      const savedBrand = await this.brandRepository.save(brand);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Brand created successfully',
        data: new BrandResponse(savedBrand),
      };
    } catch (error) {
      console.error(error);
      var message: String = error.message || 'Failed';
      if (message.includes('duplicate key value violates unique constraint')) {
        message = 'Brand already exists';
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllBrand(
    page: number = 1,
    limit: number = 10,
    name: string = '',
    admin_access_token: string,
  ): Promise<
    ApiResponse<{
      data: BrandResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    try {
      const payLoad = await this.jwtService.verifyAsync(admin_access_token);
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

      const queryBuilder = this.brandRepository
        .createQueryBuilder('brand')
        .leftJoinAndSelect('brand.products', 'product')
        .leftJoinAndSelect('product.category', 'category')
        .loadRelationCountAndMap('brand.productCount', 'brand.products')
        .orderBy('brand.name', 'ASC');

      if (name) {
        queryBuilder.where(
          new Brackets((qb) => {
            qb.where('brand.name ILIKE :name', { name: `%${name}%` });
          }),
        );
      }

      const [response, totalItems] = await Promise.all([
        queryBuilder.getMany(),
        queryBuilder.getCount(),
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

  async findByIdBrand(
    id: string,
    admin_access_token: string,
  ): Promise<ApiResponse<BrandResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

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

  async findByNameBrand(
    name: string,
    admin_access_token: string,
  ): Promise<ApiResponse<BrandResponse[]>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      const response = await this.brandRepository.find({
        where: { name: ILike(`%${name}%`) },
        relations: ['products', 'products.category'],
      });

      const data = [];
      for (let i = 0; i < response.length; i++) {
        const category = new BrandResponse(response[i]);

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

  async updateBrand(
    id: string,
    brand: BrandUpdate,
    admin_access_token: string,
  ): Promise<ApiResponse<BrandResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      if (brand.img) {
        if (
          !(brand.img.startsWith('http') || brand.img.startsWith('/images/'))
        ) {
          const uploadResult = await this.uploadToCloudinary(brand.img);
          brand.img = uploadResult;
        }
      }

      await this.brandRepository.update({ id }, brand);

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
        message: 'Brand updated successfully',
        data,
      };
    } catch (error) {
      console.error(error);
      var message: String = error.message || 'Failed';
      if (message.includes('duplicate key value violates unique constraint')) {
        message = 'Brand already exists';
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteBrand(
    id: string,
    admin_access_token: string,
  ): Promise<ApiResponse<BrandResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

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

  /* PRODUCT ENDPOINTS  */

  async createProduct(
    product: ProductCreate,
    admin_access_token: string,
  ): Promise<ApiResponse<ProductResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      const testUnique = await this.productRepository.findOne({
        where: { name: product.name },
      });
      if (testUnique) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Product already exists',
          data: null,
        };
      }

      if (product.img?.length > 0) {
        const updatedImages = await Promise.all(
          product.img.map(async (image) => {
            if (image.startsWith('http') || image.startsWith('/images/')) {
              return image;
            }
            return await this.uploadToCloudinary(image);
          }),
        );
        product.img = updatedImages;
      }

      const savedProduct = await this.productRepository.save(product);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Product created successfully',
        data: new ProductResponse(savedProduct),
      };
    } catch (error) {
      console.error(error);
      var message: String = error.message || 'Failed';
      if (
        message.includes('duplicate key value violates unique constraint') ||
        message.includes('Product already exists')
      ) {
        message = 'Product already exists';
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createByListProduct(
    product: any,
    admin_access_token: string,
  ): Promise<ApiResponse<ProductResponse[]>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

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

  async findAllProduct(
    page: number = 1,
    limit: number = 10,
    name: string = '',
    admin_access_token: string,
  ): Promise<
    ApiResponse<{
      data: ProductResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      const [response, totalItems] = await this.productRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        relations: ['category', 'brand', 'orderProducts'],
        where: [{ name: ILike(`%${name}%`) }, isUUID(name) ? { id: name } : {}],
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

  async findByIdProduct(
    id: string,
    admin_access_token: string,
  ): Promise<ApiResponse<ProductResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

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

  async findByNameProduct(
    name: string,
    admin_access_token: string,
  ): Promise<ApiResponse<ProductResponse[]>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      const response = await this.productRepository.find({
        where: { name: ILike(`%${name}%`) },
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

  async findMostPopularProduct(
    page: number = 1,
    limit: number = 10,
    admin_access_token: string,
  ): Promise<
    ApiResponse<{
      data: ProductResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    try {
      const account = await this.verifyAdmin(admin_access_token);

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

  async searchProduct(
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
    admin_access_token: string,
  ): Promise<
    ApiResponse<{
      data: ProductResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      const queryBuilder = this.productRepository.createQueryBuilder('product');
      queryBuilder.leftJoinAndSelect('product.category', 'category');
      queryBuilder.leftJoinAndSelect('product.brand', 'brand');
      queryBuilder.leftJoinAndSelect('product.orderProducts', 'orderProducts');
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

  async updateProduct(
    id: string,
    product: ProductUpdate,
    admin_access_token: string,
  ): Promise<ApiResponse<ProductResponse>> {
    const account = await this.verifyAdmin(admin_access_token);

    const existingProduct = await this.productRepository.findOne({
      where: { id },
    });

    if (!existingProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    if (product.name && existingProduct.name !== product.name) {
      const nameExists = await this.productRepository.findOne({
        where: { name: product.name },
      });

      if (nameExists) {
        throw new HttpException(
          'Product already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (product.img?.length > 0) {
      const updatedImages = await Promise.all(
        product.img.map(async (image) => {
          if (image.startsWith('http') || image.startsWith('/images/')) {
            return image;
          }
          return await this.uploadToCloudinary(image);
        }),
      );
      product.img = updatedImages;
    }

    await this.productRepository.update(id, product);

    const updatedProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'brand'],
    });

    if (!updatedProduct) {
      throw new HttpException(
        'Failed to retrieve updated product',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Product updated successfully',
      data: new ProductResponse(updatedProduct),
    };
  }

  async deleteProduct(
    id: string,
    admin_access_token: string,
  ): Promise<ApiResponse<ProductResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

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

  /* ORDER ENDPOINTS */

  async createOrder(
    order: OrderCreate,
    admin_access_token: string,
  ): Promise<ApiResponse<OrderResponse>> {
    try {
      const orderItems: Record<string, number> = order.cart;
      const { id } = await this.orderRepository.save(order);

      const orderResponse = await this.orderRepository.findOne({
        where: { id },
        relations: ['order_Products'],
      });

      for (const id in orderItems) {
        const orderItem = new OrderProduct();

        const product = await this.productRepository.findOne({
          where: { id },
        });

        orderItem.order = orderResponse;
        orderItem.quantity = orderItems[id];
        orderItem.product = product;

        if (orderItems[id] > 5) {
          orderItem.price =
            product.soldMultiPrice !== 0
              ? product.soldMultiPrice
              : product.normalMultiPrice;
        } else {
          orderItem.price =
            product.soldSinglePrice !== 0
              ? product.soldSinglePrice
              : product.normalSinglePrice;
        }

        const savedOrderItem =
          await this.orderProductRepository.save(orderItem);

        orderResponse.order_Products.push(savedOrderItem);
      }

      if (admin_access_token !== null && admin_access_token != 'null') {
        const payLoad = await this.jwtService.verifyAsync(admin_access_token);

        const account = await this.usersRepository.findOne({
          where: { id: payLoad.id },
          relations: ['orders'],
        });

        if (!account || account.nonce !== payLoad.nonce) {
          return {
            statusCode: HttpStatus.FORBIDDEN,
            message: 'Unauthorized access',
            data: null,
          };
        }
        account.orders.push(orderResponse);
        await this.usersRepository.save(account);
      }

      const { id: orderId } = await this.orderRepository.save(orderResponse);
      const data = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['order_Products'],
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Order created successfully',
        data: new OrderResponse(data),
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'Failed to create order',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllOrder(
    page: number = 1,
    limit: number = 10,
    sort: string = 'created_At',
    order: string = 'ASC',
    search: string = '',
    state: string = '',
    admin_access_token: string,
  ): Promise<
    ApiResponse<{
      data: OrderResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    try {
      const account = await this.verifyAdmin(admin_access_token);
      const skip = (page - 1) * limit;

      const queryBuilder = this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.order_Products', 'order_Products')
        .leftJoinAndSelect('order_Products.product', 'product');

      if (search) {
        const searchLower = search.toLowerCase().trim();

        const isValidUUID =
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            searchLower,
          );

        if (isValidUUID) {
          queryBuilder.where('order.id = :id', { id: searchLower });
        } else {
          queryBuilder.where(
            '(LOWER(order.first_name) LIKE :search OR LOWER(order.last_name) LIKE :search OR LOWER(order.email) LIKE :search OR LOWER(order.phone) LIKE :search OR LOWER(order.city) LIKE :search)',
            { search: `%${searchLower}%` },
          );
        }
      }

      if (state) {
        if (search) {
          queryBuilder.andWhere('order.state = :state', { state });
        } else {
          queryBuilder.where('order.state = :state', { state });
        }
      }

      const allowedSortFields = [
        'created_At',
        'first_name',
        'last_name',
        'email',
        'state',
        'city',
        'type',
        'deliveryPrice',
        'order_Products',
        'total_Price',
      ];

      const sortField = allowedSortFields.includes(sort) ? sort : 'created_At';

      if (sortField === 'order_Products') {
        queryBuilder.loadRelationCountAndMap(
          'order.products_count',
          'order.order_Products',
        );

        queryBuilder.addSelect((subQuery) => {
          return subQuery
            .select('COUNT(op.id)', 'products_count')
            .from(OrderProduct, 'op')
            .where('op.orderId = order.id');
        }, 'products_count');
        queryBuilder.orderBy(
          'products_count',
          order.toUpperCase() as 'ASC' | 'DESC',
        );
      } else if (sortField === 'total_Price') {
        queryBuilder.addSelect((subQuery) => {
          return subQuery
            .select(
              'COALESCE(SUM(op.price * op.quantity), 0) + o.deliveryPrice',
              'total_price',
            )
            .from(OrderProduct, 'op')
            .leftJoin(Order, 'o', 'o.id = op.orderId')
            .where('op.orderId = order.id')
            .groupBy('o.id');
        }, 'total_price');

        queryBuilder.orderBy(
          'total_price',
          order.toUpperCase() as 'ASC' | 'DESC',
        );
      } else {
        queryBuilder.orderBy(
          `order.${sortField}`,
          order.toUpperCase() as 'ASC' | 'DESC',
        );
      }

      queryBuilder.skip(skip).take(limit);

      const [orders, totalItems] = await queryBuilder.getManyAndCount();

      const data = orders.map((order) => new OrderResponse(order));

      return {
        statusCode: HttpStatus.OK,
        message: 'Orders retrieved successfully',
        data: {
          data,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
          totalItems,
        },
      };
    } catch (error) {
      console.error(error);

      if (error instanceof UnauthorizedException) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Unauthorized access',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (error.code === '22P02') {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid ID format',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve Orders',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByIdOrder(
    id: string,
    admin_access_token: string,
  ): Promise<ApiResponse<OrderResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      const response = await this.orderRepository.findOne({
        where: { id },
        relations: ['order_Products',"order_Products.product"],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Order not found',
          data: null,
        };

      const data = new OrderResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'Order retrieved successfully',
        data,
      };
    } catch (error) {
      console.error(error);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve Order',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOrder(
    id: string,
    order: OrderUpdate,
    admin_access_token: string,
  ): Promise<ApiResponse<OrderResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      await this.orderRepository.update(id, order);

      const response = await this.orderRepository.findOne({
        where: { id },
        relations: ['order_Products'],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Order not found',
          data: null,
        };

      const data = new OrderResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'Order updated successfully',
        data,
      };
    } catch (error) {
      console.error(error);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to Update Order',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteOrder(
    id: string,
    admin_access_token: string,
  ): Promise<ApiResponse<OrderResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      const response = await this.orderRepository.findOne({
        where: { id },
        relations: ['order_Products'],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Order not found',
          data: null,
        };

      await this.orderRepository.delete(id);

      const data = new OrderResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'Order deleted successfully',
        data,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to Delete Order',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* SPECIALOFFER ENDPOINTS */

  async createSpecialOffer(
    specialOffer: SpecialOfferCreate,
    admin_access_token: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      if (specialOffer.img) {
        if (
          !(
            specialOffer.img.startsWith('http') ||
            specialOffer.img.startsWith('/images/')
          )
        ) {
          const uploadResult = await this.uploadToCloudinary(specialOffer.img);
          specialOffer.img = uploadResult;
        }
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

  async findAllSpecialOffer(
    page: number = 1,
    limit: number = 10,
    admin_access_token: string,
  ): Promise<
    ApiResponse<{
      data: SpecialOfferResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    try {
      const account = await this.verifyAdmin(admin_access_token);

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

  async findByIdSpecialOffer(
    id: string,
    admin_access_token: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

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

  async updateSpecialOffer(
    id: string,
    specialOffer: SpecialOfferUpdate,
    admin_access_token: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      if (specialOffer.img) {
        if (
          !(
            specialOffer.img.startsWith('http') ||
            specialOffer.img.startsWith('/images/')
          )
        ) {
          const uploadResult = await this.uploadToCloudinary(specialOffer.img);
          specialOffer.img = uploadResult;
        }
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

  async deleteSpecialOffer(
    id: string,
    admin_access_token: string,
  ): Promise<ApiResponse<SpecialOfferResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

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

  /* CUSTOMIZATION ENDPOINTS */

  async createCustomization(
    customization: CustomizationCreate,
    admin_access_token: string,
  ): Promise<ApiResponse<CustomizationResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

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

  async findCustomization(
    admin_access_token: string,
  ): Promise<ApiResponse<CustomizationResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      const response = await this.customizationRepository.find({
        relations: [
          'featuredProducts',
          'featuredProducts.category',
          'featuredProducts.brand',
          'featuredProducts.orderProducts',
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

  async findByIdCustomization(
    id: string,
    admin_access_token: string,
  ): Promise<ApiResponse<CustomizationResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      const response = await this.customizationRepository.findOne({
        where: { id },
        relations: [
          'featuredProducts',
          'featuredProducts.category',
          'featuredProducts.brand',
          'featuredProducts.orderProducts',
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

  async updateCustomization(
    id: string,
    customization: CustomizationUpdate,
    admin_access_token: string,
  ): Promise<ApiResponse<CustomizationResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      if (
        customization.featuredProducts ||
        customization.brands ||
        customization.categories
      ) {
        const oldData = await this.customizationRepository.findOne({
          where: { id },
          relations: [
            'featuredProducts',
            'featuredProducts.category',
            'featuredProducts.brand',
            'brands',
            'categories',
          ],
        });
        if (!oldData) {
          return {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Customization not found',
            data: null,
          };
        }

        if (customization.featuredProducts) {
          const featuredProducts = [];
          for (let i = 0; i < customization.featuredProducts.length; i++) {
            const product = await this.productRepository.findOne({
              where: { id: customization.featuredProducts[i].id },
              relations: ['category', 'brand'],
            });
            featuredProducts.push(product);
          }
          oldData.featuredProducts = featuredProducts;
        }
        if (customization.categories) {
          const categories = [];
          for (let i = 0; i < customization.categories.length; i++) {
            const category = await this.categoryRepository.findOne({
              where: { id: customization.categories[i].id },
            });
            categories.push(category);
          }
          oldData.categories = categories;
        }
        if (customization.brands) {
          const brands = [];
          for (let i = 0; i < customization.brands.length; i++) {
            const brand = await this.brandRepository.findOne({
              where: { id: customization.brands[i].id },
            });
            brands.push(brand);
          }
          oldData.brands = brands;
        }
        await this.customizationRepository.save(oldData);
      } else {
        await this.customizationRepository.update({ id }, customization);
      }

      const response = await this.customizationRepository.findOne({
        where: { id },
        relations: [
          'featuredProducts',
          'featuredProducts.category',
          'featuredProducts.brand',
          'featuredProducts.orderProducts',
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

  async deleteCustomization(
    id: string,
    admin_access_token: string,
  ): Promise<ApiResponse<CustomizationResponse>> {
    try {
      const account = await this.verifyAdmin(admin_access_token);

      const response = await this.customizationRepository.findOne({
        where: { id },
        relations: [
          'featuredProducts',
          'featuredProducts.category',
          'featuredProducts.brand',
          'featuredProducts.orderProducts',
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
