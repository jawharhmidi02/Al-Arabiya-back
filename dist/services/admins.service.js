"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_entity_1 = require("../entities/users.entity");
const users_dto_1 = require("../dto/users.dto");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const jwt_constant_1 = require("../constants/jwt.constant");
const nodemailer = require("nodemailer");
const categories_entity_1 = require("../entities/categories.entity");
const categories_dto_1 = require("../dto/categories.dto");
const brands_entity_1 = require("../entities/brands.entity");
const orderProduct_entity_1 = require("../entities/orderProduct.entity");
const orders_entity_1 = require("../entities/orders.entity");
const products_entity_1 = require("../entities/products.entity");
const brands_dto_1 = require("../dto/brands.dto");
const products_dto_1 = require("../dto/products.dto");
const orders_dto_1 = require("../dto/orders.dto");
const specialOffers_dto_1 = require("../dto/specialOffers.dto");
const specialOffers_entity_1 = require("../entities/specialOffers.entity");
const cloudinary_1 = require("cloudinary");
const customizations_entity_1 = require("../entities/customizations.entity");
const customizations_dto_1 = require("../dto/customizations.dto");
const class_validator_1 = require("class-validator");
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.CRYPTO_SECRET_KEY, 'hex');
const iv = (0, crypto_1.randomBytes)(16);
function encrypt(text) {
    let cipher = (0, crypto_1.createCipheriv)(algorithm, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = (0, crypto_1.createDecipheriv)(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
let AdminService = class AdminService {
    constructor(usersRepository, categoryRepository, brandRepository, orderRepository, orderProductRepository, productRepository, specialOfferRepository, customizationRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.orderRepository = orderRepository;
        this.orderProductRepository = orderProductRepository;
        this.productRepository = productRepository;
        this.specialOfferRepository = specialOfferRepository;
        this.customizationRepository = customizationRepository;
        this.jwtService = jwtService;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async uploadToCloudinary(base64Image) {
        try {
            const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary_1.v2.uploader.upload(`data:image/png;base64,${base64Data}`, {
                    folder: 'Al-Arabiya',
                    resource_type: 'auto',
                }, (error, result) => {
                    if (error)
                        reject(error);
                    resolve(result);
                });
            });
            return uploadResult.secure_url;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to upload image', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async verifyAdmin(admin_access_token) {
        try {
            const payload = await this.jwtService.verifyAsync(admin_access_token);
            const account = await this.usersRepository.findOne({
                where: { id: payload.id },
            });
            if (!account ||
                account.nonce !== payload.nonce ||
                account.role !== 'admin') {
                throw new common_1.HttpException('Unauthorized access', common_1.HttpStatus.FORBIDDEN);
            }
            return account;
        }
        catch (error) {
            throw new common_1.HttpException('Invalid or expired token', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async signin(email, password) {
        try {
            const response = await this.usersRepository.findOne({
                where: { email: email.toLowerCase() },
            });
            if (!response || decrypt(response.password) !== password) {
                return {
                    statusCode: common_1.HttpStatus.UNAUTHORIZED,
                    message: 'Invalid credentials',
                    data: null,
                };
            }
            if (response.role !== 'admin') {
                return {
                    statusCode: common_1.HttpStatus.UNAUTHORIZED,
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
                statusCode: common_1.HttpStatus.OK,
                message: 'Sign-in successful',
                data: { admin_access_token: accessToken },
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Signin failed',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAccount(token) {
        try {
            const payLoad = await this.jwtService.verifyAsync(token);
            const response = await this.usersRepository.findOne({
                where: { id: payLoad.id },
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Account not found',
                    data: null,
                };
            if (response.nonce !== payLoad.nonce) {
                return {
                    statusCode: common_1.HttpStatus.UNAUTHORIZED,
                    message: 'Invalid token',
                    data: null,
                };
            }
            if (response.role !== 'admin') {
                return {
                    statusCode: common_1.HttpStatus.UNAUTHORIZED,
                    message: 'Unauthorized access',
                    data: null,
                };
            }
            const data = new users_dto_1.UsersResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Account retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve account',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendRecoverPassViaEmail(email) {
        try {
            const response = await this.usersRepository.findOne({
                where: { email: email.toLowerCase() },
            });
            if (!response) {
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Email not found',
                    data: null,
                };
            }
            if (response.role !== 'admin') {
                return {
                    statusCode: common_1.HttpStatus.FORBIDDEN,
                    message: 'Only admins can recover password',
                    data: null,
                };
            }
            const admin_access_token = await this.jwtService.signAsync({
                id: response.id,
                email: email.toLowerCase(),
                nonce: response.nonce,
            }, { expiresIn: '10m', secret: jwt_constant_1.jwtConstants.secret });
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
                    statusCode: common_1.HttpStatus.OK,
                    message: 'Email sent successfully',
                    data: null,
                };
            }
            else {
                return {
                    statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to send email',
                    data: null,
                };
            }
        }
        catch (error) {
            console.error(error);
            return {
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to send email',
                data: null,
            };
        }
    }
    async recoverPageHtml(admin_access_token) {
        try {
            const payLoad = await this.jwtService.verifyAsync(admin_access_token, {
                secret: jwt_constant_1.jwtConstants.secret,
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
        }
        catch (error) {
            console.error(error);
            return `<h1>حدث خطأ أثناء معالجة طلبك</h1>`;
        }
    }
    async changePasswordFromRecover(admin_access_token, newPassword) {
        try {
            const payLoad = await this.jwtService.verifyAsync(admin_access_token, {
                secret: jwt_constant_1.jwtConstants.secret,
            });
            if (!payLoad.email) {
                return {
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Invalid token',
                    data: null,
                };
            }
            const user = await this.usersRepository.findOne({
                where: { email: payLoad.email.toLowerCase() },
            });
            if (!user) {
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'User not found',
                    data: null,
                };
            }
            if (user.role !== 'admin') {
                return {
                    statusCode: common_1.HttpStatus.FORBIDDEN,
                    message: 'You are not authorized to change password',
                    data: null,
                };
            }
            const currentPassword = decrypt(user.password);
            if (newPassword === currentPassword) {
                return {
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: 'New password cannot be the same as the current password',
                    data: null,
                };
            }
            const newNonce = (0, crypto_1.randomBytes)(16).toString('hex');
            user.nonce = newNonce;
            user.password = encrypt(newPassword);
            await this.usersRepository.update({ email: payLoad.email.toLowerCase() }, user);
            const updatedUser = await this.usersRepository.findOne({
                where: { email: payLoad.email.toLowerCase() },
            });
            const data = new users_dto_1.UsersResponse(updatedUser);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Password changed successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            return {
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to change password',
                data: null,
            };
        }
    }
    async findAllUser(admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const response = await this.usersRepository.find();
            const data = response.map((user) => new users_dto_1.UsersResponse(user));
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Users retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error.response);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve users',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByIdUser(id, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const response = await this.usersRepository.findOne({ where: { id } });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'User not found',
                    data: null,
                };
            const data = new users_dto_1.UsersResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'User retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve user',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateUser(id, user, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            if (id === account.id) {
                if (user.current_password &&
                    user.current_password !== decrypt(account.password)) {
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
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'User not found',
                    data: null,
                };
            const data = new users_dto_1.UsersResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'User updated successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            var message = error.message || 'Signup Failed';
            if (message.includes('duplicate key value violates unique constraint')) {
                message = 'Email already exists';
            }
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteUser(id, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const response = await this.usersRepository.findOne({ where: { id } });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'User not found',
                    data: null,
                };
            await this.usersRepository.delete(id);
            const data = new users_dto_1.UsersResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'User deleted successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to delete user',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createCategory(category, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const savedCategory = await this.categoryRepository.save(category);
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Category created successfully',
                data: new categories_dto_1.CategoryResponse(savedCategory),
            };
        }
        catch (error) {
            console.error(error);
            var message = error.message || 'Failed';
            if (message.includes('duplicate key value violates unique constraint')) {
                message = 'Category already exists';
            }
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAllCategory(page = 1, limit = 10, name = '', admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const [response, totalItems] = await this.categoryRepository.findAndCount({
                where: [
                    { name: (0, typeorm_2.ILike)(`%${name}%`) },
                    (0, class_validator_1.isUUID)(name) ? { id: name } : {},
                ],
                skip: (page - 1) * limit,
                take: limit,
                relations: ['products', 'products.brand'],
            });
            const data = [];
            for (let i = 0; i < response.length; i++) {
                const category = new categories_dto_1.CategoryResponse(response[i]);
                data.push(category);
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Categories retrieved successfully',
                data: {
                    data: data,
                    totalPages: Math.ceil(totalItems / limit),
                    currentPage: page,
                    totalItems,
                },
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Categories',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByIdCategory(id, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const response = await this.categoryRepository.findOne({
                where: { id },
                relations: ['products', 'products.brand'],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Category not found',
                    data: null,
                };
            const data = new categories_dto_1.CategoryResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Category retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Category',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByNameCategory(name, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const response = await this.categoryRepository.find({
                where: { name: (0, typeorm_2.ILike)(`%${name}%`) },
                relations: ['products', 'products.brand'],
            });
            const data = [];
            for (let i = 0; i < response.length; i++) {
                const category = new categories_dto_1.CategoryResponse(response[i]);
                data.push(category);
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Category retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Categories',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCategory(id, category, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            await this.categoryRepository.update({ id }, category);
            const response = await this.categoryRepository.findOne({
                where: { id },
                relations: ['products', 'products.brand'],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Category not found',
                    data: null,
                };
            const data = new categories_dto_1.CategoryResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Category updated successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            var message = error.message || 'Signup Failed';
            if (message.includes('duplicate key value violates unique constraint')) {
                message = 'Category already exists';
            }
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteCategory(id, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const response = await this.categoryRepository.findOne({
                where: { id },
                relations: ['products', 'products.brand'],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Category not found',
                    data: null,
                };
            await this.categoryRepository.delete(id);
            const data = new categories_dto_1.CategoryResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Category deleted successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Delete Category',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createBrand(brand, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            if (brand.img) {
                if (!(brand.img.startsWith('http') || brand.img.startsWith('/images/'))) {
                    const uploadResult = await this.uploadToCloudinary(brand.img);
                    brand.img = uploadResult;
                }
            }
            const savedBrand = await this.brandRepository.save(brand);
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Brand created successfully',
                data: new brands_dto_1.BrandResponse(savedBrand),
            };
        }
        catch (error) {
            console.error(error);
            var message = error.message || 'Failed';
            if (message.includes('duplicate key value violates unique constraint')) {
                message = 'Brand already exists';
            }
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAllBrand(page = 1, limit = 10, name = '', admin_access_token) {
        try {
            const payLoad = await this.jwtService.verifyAsync(admin_access_token);
            const account = await this.usersRepository.findOne({
                where: { id: payLoad.id },
            });
            if (!account ||
                account.nonce !== payLoad.nonce ||
                account.role !== 'admin') {
                return {
                    statusCode: common_1.HttpStatus.FORBIDDEN,
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
                queryBuilder.where(new typeorm_2.Brackets((qb) => {
                    qb.where('brand.name ILIKE :name', { name: `%${name}%` });
                }));
            }
            const [response, totalItems] = await Promise.all([
                queryBuilder.getMany(),
                queryBuilder.getCount(),
            ]);
            if (!response) {
                throw new Error('Failed to fetch brands');
            }
            const sortedResponse = response.sort((a, b) => (b.productCount || 0) - (a.productCount || 0));
            const data = sortedResponse
                .slice((page - 1) * limit, page * limit)
                .map((brand) => new brands_dto_1.BrandResponse(brand));
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Brands retrieved successfully',
                data: {
                    data,
                    totalPages: Math.ceil(totalItems / limit),
                    currentPage: page,
                    totalItems,
                },
            };
        }
        catch (error) {
            console.error('Detailed error:', {
                error: error,
                stack: error.stack,
                message: error.message,
            });
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to retrieve Brands: ' + error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByIdBrand(id, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const response = await this.brandRepository.findOne({
                where: { id },
                relations: ['products', 'products.category'],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Brand not found',
                    data: null,
                };
            const data = new brands_dto_1.BrandResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Brand retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Brand',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByNameBrand(name, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const response = await this.brandRepository.find({
                where: { name: (0, typeorm_2.ILike)(`%${name}%`) },
                relations: ['products', 'products.category'],
            });
            const data = [];
            for (let i = 0; i < response.length; i++) {
                const category = new brands_dto_1.BrandResponse(response[i]);
                data.push(category);
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Brand retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Brands',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateBrand(id, brand, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            if (brand.img) {
                if (!(brand.img.startsWith('http') || brand.img.startsWith('/images/'))) {
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
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Brand not found',
                    data: null,
                };
            const data = new brands_dto_1.BrandResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Brand updated successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            var message = error.message || 'Failed';
            if (message.includes('duplicate key value violates unique constraint')) {
                message = 'Brand already exists';
            }
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteBrand(id, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const response = await this.brandRepository.findOne({
                where: { id },
                relations: ['products', 'products.category'],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Brand not found',
                    data: null,
                };
            await this.brandRepository.delete(id);
            const data = new brands_dto_1.BrandResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Brand deleted successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Delete Brand',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createProduct(product, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const testUnique = await this.productRepository.findOne({
                where: { name: product.name },
            });
            if (testUnique) {
                return {
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Product already exists',
                    data: null,
                };
            }
            if (product.img?.length > 0) {
                const updatedImages = await Promise.all(product.img.map(async (image) => {
                    if (image.startsWith('http') || image.startsWith('/images/')) {
                        return image;
                    }
                    return await this.uploadToCloudinary(image);
                }));
                product.img = updatedImages;
            }
            const savedProduct = await this.productRepository.save(product);
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Product created successfully',
                data: new products_dto_1.ProductResponse(savedProduct),
            };
        }
        catch (error) {
            console.error(error);
            var message = error.message || 'Failed';
            if (message.includes('duplicate key value violates unique constraint') ||
                message.includes('Product already exists')) {
                message = 'Product already exists';
            }
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createByListProduct(product, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const savedProduct = [];
            for (let i = 0; i < product.length; i++) {
                const element = await this.productRepository.save(product[i]);
                savedProduct.push(new products_dto_1.ProductResponse(element));
            }
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Product created successfully',
                data: savedProduct,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException(error.message || 'Failed to create product', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAllProduct(page = 1, limit = 10, name = '', admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const [response, totalItems] = await this.productRepository.findAndCount({
                skip: (page - 1) * limit,
                take: limit,
                relations: ['category', 'brand', 'orderProducts'],
                where: [{ name: (0, typeorm_2.ILike)(`%${name}%`) }, (0, class_validator_1.isUUID)(name) ? { id: name } : {}],
            });
            const data = response.map((item) => new products_dto_1.ProductResponse(item));
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Products retrieved successfully',
                data: {
                    data: data,
                    totalPages: Math.ceil(totalItems / limit),
                    currentPage: page,
                    totalItems,
                },
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Products',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByIdProduct(id, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const response = await this.productRepository.findOne({
                where: { id },
                relations: ['category', 'brand'],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Product not found',
                    data: null,
                };
            const data = new products_dto_1.ProductResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Product retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Product',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByNameProduct(name, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const response = await this.productRepository.find({
                where: { name: (0, typeorm_2.ILike)(`%${name}%`) },
                relations: ['category', 'brand'],
            });
            const data = response.map((item) => new products_dto_1.ProductResponse(item));
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Product retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Products',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findMostPopularProduct(page = 1, limit = 10, admin_access_token) {
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
            const data = sortedProducts.map((item) => new products_dto_1.ProductResponse(item));
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Most Popular Products retrieved successfully',
                data: {
                    data: data,
                    totalPages: Math.ceil(totalItems / limit),
                    currentPage: page,
                    totalItems,
                },
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Most Popular Products',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async searchProduct(page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc', filters, admin_access_token) {
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
            const order = sortOrder === 'asc' ? 'ASC' : 'DESC';
            if (sortBy === 'date') {
                queryBuilder.orderBy('product.created_At', order);
            }
            else if (sortBy === 'alpha') {
                queryBuilder.orderBy('product.name', order);
            }
            else if (sortBy === 'price') {
                queryBuilder.orderBy('product.normalSinglePrice', order);
            }
            const [products, totalItems] = await queryBuilder.getManyAndCount();
            const data = products.map((product) => new products_dto_1.ProductResponse(product));
            const totalPages = Math.ceil(totalItems / limit);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Products retrieved successfully',
                data: {
                    data,
                    totalPages,
                    currentPage: page,
                    totalItems,
                },
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Products',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateProduct(id, product, admin_access_token) {
        const account = await this.verifyAdmin(admin_access_token);
        const existingProduct = await this.productRepository.findOne({
            where: { id },
        });
        if (!existingProduct) {
            throw new common_1.HttpException('Product not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (product.name && existingProduct.name !== product.name) {
            const nameExists = await this.productRepository.findOne({
                where: { name: product.name },
            });
            if (nameExists) {
                throw new common_1.HttpException('Product already exists', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (product.img?.length > 0) {
            const updatedImages = await Promise.all(product.img.map(async (image) => {
                if (image.startsWith('http') || image.startsWith('/images/')) {
                    return image;
                }
                return await this.uploadToCloudinary(image);
            }));
            product.img = updatedImages;
        }
        await this.productRepository.update(id, product);
        const updatedProduct = await this.productRepository.findOne({
            where: { id },
            relations: ['category', 'brand'],
        });
        if (!updatedProduct) {
            throw new common_1.HttpException('Failed to retrieve updated product', common_1.HttpStatus.NOT_FOUND);
        }
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Product updated successfully',
            data: new products_dto_1.ProductResponse(updatedProduct),
        };
    }
    async deleteProduct(id, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const response = await this.productRepository.findOne({
                where: { id },
                relations: ['category', 'brand'],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Product not found',
                    data: null,
                };
            await this.productRepository.delete(id);
            const data = new products_dto_1.ProductResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Product deleted successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Delete Product',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createOrder(order, admin_access_token) {
        try {
            const orderItems = order.cart;
            const { id } = await this.orderRepository.save(order);
            const orderResponse = await this.orderRepository.findOne({
                where: { id },
                relations: ['order_Products'],
            });
            for (const id in orderItems) {
                const orderItem = new orderProduct_entity_1.OrderProduct();
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
                }
                else {
                    orderItem.price =
                        product.soldSinglePrice !== 0
                            ? product.soldSinglePrice
                            : product.normalSinglePrice;
                }
                const savedOrderItem = await this.orderProductRepository.save(orderItem);
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
                        statusCode: common_1.HttpStatus.FORBIDDEN,
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
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Order created successfully',
                data: new orders_dto_1.OrderResponse(data),
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException(error.message || 'Failed to create order', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAllOrder(page = 1, limit = 10, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const [response, totalItems] = await this.orderRepository.findAndCount({
                skip: (page - 1) * limit,
                take: limit,
                relations: ['order_Products'],
            });
            const data = response.map((item) => new orders_dto_1.OrderResponse(item));
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Orders retrieved successfully',
                data: {
                    data: data,
                    totalPages: Math.ceil(totalItems / limit),
                    currentPage: page,
                    totalItems,
                },
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Orders',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByIdOrder(id, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const response = await this.orderRepository.findOne({
                where: { id },
                relations: ['order_Products'],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Order not found',
                    data: null,
                };
            const data = new orders_dto_1.OrderResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Order retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Order',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateOrder(id, order, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            await this.orderRepository.update(id, order);
            const response = await this.orderRepository.findOne({
                where: { id },
                relations: ['order_Products'],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Order not found',
                    data: null,
                };
            const data = new orders_dto_1.OrderResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Order updated successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Update Order',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteOrder(id, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const response = await this.orderRepository.findOne({
                where: { id },
                relations: ['order_Products'],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Order not found',
                    data: null,
                };
            await this.orderRepository.delete(id);
            const data = new orders_dto_1.OrderResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Order deleted successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Delete Order',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createSpecialOffer(specialOffer, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            if (specialOffer.img) {
                if (!(specialOffer.img.startsWith('http') ||
                    specialOffer.img.startsWith('/images/'))) {
                    const uploadResult = await this.uploadToCloudinary(specialOffer.img);
                    specialOffer.img = uploadResult;
                }
            }
            const savedSpecialOffer = await this.specialOfferRepository.save(specialOffer);
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'SpecialOffer created successfully',
                data: new specialOffers_dto_1.SpecialOfferResponse(savedSpecialOffer),
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException(error.message || 'Failed to create SpecialOffer', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAllSpecialOffer(page = 1, limit = 10, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const [response, totalItems] = await this.specialOfferRepository.findAndCount({
                skip: (page - 1) * limit,
                take: limit,
            });
            const data = response.map((item) => new specialOffers_dto_1.SpecialOfferResponse(item));
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'SpecialOffers retrieved successfully',
                data: {
                    data: data,
                    totalPages: Math.ceil(totalItems / limit),
                    currentPage: page,
                    totalItems,
                },
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve SpecialOffers',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByIdSpecialOffer(id, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const response = await this.specialOfferRepository.findOne({
                where: { id },
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'SpecialOffer not found',
                    data: null,
                };
            const data = new specialOffers_dto_1.SpecialOfferResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'SpecialOffer retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve SpecialOffer',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateSpecialOffer(id, specialOffer, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            if (specialOffer.img) {
                if (!(specialOffer.img.startsWith('http') ||
                    specialOffer.img.startsWith('/images/'))) {
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
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'SpecialOffer not found',
                    data: null,
                };
            const data = new specialOffers_dto_1.SpecialOfferResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'SpecialOffer updated successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Update SpecialOffer',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteSpecialOffer(id, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const response = await this.specialOfferRepository.findOne({
                where: { id },
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'SpecialOffer not found',
                    data: null,
                };
            await this.specialOfferRepository.delete(id);
            const data = new specialOffers_dto_1.SpecialOfferResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'SpecialOffer deleted successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Delete SpecialOffer',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createCustomization(customization, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            const count = await this.customizationRepository.count();
            if (count > 0) {
                throw new common_1.HttpException('Customization already exists', common_1.HttpStatus.BAD_REQUEST);
            }
            const savedCustomization = await this.customizationRepository.save(customization);
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Customization created successfully',
                data: new customizations_dto_1.CustomizationResponse(savedCustomization),
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException(error.message || 'Failed to create customization', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findCustomization(admin_access_token) {
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
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Customization not found',
                    data: null,
                };
            const data = new customizations_dto_1.CustomizationResponse(response[0]);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Customization retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Customization',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByIdCustomization(id, admin_access_token) {
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
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Customization not found',
                    data: null,
                };
            const data = new customizations_dto_1.CustomizationResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Customization retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Customization',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCustomization(id, customization, admin_access_token) {
        try {
            const account = await this.verifyAdmin(admin_access_token);
            if (customization.featuredProducts ||
                customization.brands ||
                customization.categories) {
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
                        statusCode: common_1.HttpStatus.NOT_FOUND,
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
            }
            else {
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
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Customization not found',
                    data: null,
                };
            const data = new customizations_dto_1.CustomizationResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Customization updated successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Update Customization',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCustomization(id, admin_access_token) {
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
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Customization not found',
                    data: null,
                };
            await this.customizationRepository.delete(id);
            const data = new customizations_dto_1.CustomizationResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Customization deleted successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Delete Customization',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __param(1, (0, typeorm_1.InjectRepository)(categories_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(brands_entity_1.Brand)),
    __param(3, (0, typeorm_1.InjectRepository)(orders_entity_1.Order)),
    __param(4, (0, typeorm_1.InjectRepository)(orderProduct_entity_1.OrderProduct)),
    __param(5, (0, typeorm_1.InjectRepository)(products_entity_1.Product)),
    __param(6, (0, typeorm_1.InjectRepository)(specialOffers_entity_1.SpecialOffer)),
    __param(7, (0, typeorm_1.InjectRepository)(customizations_entity_1.Customization)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AdminService);
//# sourceMappingURL=admins.service.js.map