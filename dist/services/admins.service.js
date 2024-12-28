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
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
    }
    async signup(user) {
        try {
            user.password = encrypt(user.password);
            const response = await this.usersRepository.save(user);
            const data = new users_dto_1.UsersResponse(response);
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'User signed up successfully',
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
    async signin(email, password) {
        try {
            const response = await this.usersRepository.findOne({ where: { email } });
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
                data: { access_token: accessToken },
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
    async findAll(access_token) {
        try {
            const payLoad = await this.jwtService.verifyAsync(access_token);
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
    async findById(id, access_token) {
        try {
            const payLoad = await this.jwtService.verifyAsync(access_token);
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
    async update(id, user, access_token) {
        try {
            const payLoad = await this.jwtService.verifyAsync(access_token);
            const account = await this.usersRepository.findOne({
                where: { id: payLoad.id },
            });
            if (payLoad.id !== id && (!account || account.role !== 'admin')) {
                return {
                    statusCode: common_1.HttpStatus.FORBIDDEN,
                    message: 'Unauthorized access',
                    data: null,
                };
            }
            if (account.nonce !== payLoad.nonce) {
                return {
                    statusCode: common_1.HttpStatus.FORBIDDEN,
                    message: 'Invalid nonce',
                    data: null,
                };
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
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to update user',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id, access_token) {
        try {
            const payLoad = await this.jwtService.verifyAsync(access_token);
            const account = await this.usersRepository.findOne({
                where: { id: payLoad.id },
            });
            if (payLoad.id !== id && (!account || account.role !== 'admin')) {
                return {
                    statusCode: common_1.HttpStatus.FORBIDDEN,
                    message: 'Unauthorized access',
                    data: null,
                };
            }
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
    async sendRecoverPassViaEmail(email) {
        try {
            const response = await this.usersRepository.findOne({
                where: { email },
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
            const access_token = await this.jwtService.signAsync({
                id: response.id,
                email: email,
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
            <a href="${process.env.API_URL}/users/recoverhtml?access_token=${access_token}" target="_blank">إعادة تعيين كلمة المرور</a>
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
                to: email,
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
            console.log(error);
            return {
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to send email',
                data: null,
            };
        }
    }
    async recoverPageHtml(access_token) {
        try {
            const payLoad = await this.jwtService.verifyAsync(access_token, {
                secret: jwt_constant_1.jwtConstants.secret,
            });
            if (payLoad.email == undefined) {
                throw new Error();
            }
            const response = await this.usersRepository.findOne({
                where: { email: payLoad.email },
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
          const access_token = new URLSearchParams(window.location.search).get("access_token");

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

          if (access_token) {
            try {
              const response = await fetch(
                \`${process.env.API_URL}/users/changepassfromrecover/\${password}?access_token=\${access_token}\`,
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
    async changePasswordFromRecover(access_token, newPassword) {
        try {
            const payLoad = await this.jwtService.verifyAsync(access_token, {
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
                where: { email: payLoad.email },
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
            await this.usersRepository.update({ email: payLoad.email }, user);
            const updatedUser = await this.usersRepository.findOne({
                where: { email: payLoad.email },
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AdminService);
//# sourceMappingURL=admins.service.js.map