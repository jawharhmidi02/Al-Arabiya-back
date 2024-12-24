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
exports.UsersService = void 0;
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
let UsersService = class UsersService {
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
            const access_token = await this.jwtService.signAsync({
                id: response.id,
                email: email,
                nonce: response.nonce,
            }, { expiresIn: '10m', secret: jwt_constant_1.jwtConstants.secret });
            const html = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GoldenBrand Password Recovery</title>
    <style>
        body {
            font-family: 'Ubuntu', sans-serif;
            background-color: var(--bg, #f5f6f7);
            color: #333;
            margin: 0;
            padding: 20px;
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
            color: var(--theme1, #fbbf24);
        }
        .content {
            padding: 20px 0;
        }
        .content p {
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .content a {
            display: inline-block;
            background-color: var(--theme1, #fbbf24);
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }
        .content a:hover {
            background-color: var(--theme2, #fcd34d);
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
        <div class="header">Golden<span style="color: #333;">Brand</span></div>
        <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your GoldenBrand password. Click the button below to proceed:</p>
            <a href="${process.env.API_URL}/users/recoverhtml?access_token=${access_token}" target="_blank">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 GoldenBrand. All rights reserved.</p>
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
            var html = `
      <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GoldenBrand: Reset Password</title>
    <style>
      body {
        font-family: "Ubuntu", sans-serif;
        background-color: var(--bg, #f5f6f7);
        color: #333;
        margin: 0;
        padding: 20px;
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
        color: var(--theme1, #fbbf24);
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
        background-color: var(--theme1, #fbbf24);
        color: #ffffff;
        border: none;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      .form-group button:hover {
        background-color: var(--theme2, #fcd34d);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Golden<span style="color: #333">Brand</span></div>
      <form id="resetForm">
        <div class="form-group">
          <label for="password">New Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div class="form-group">
          <button type="button" id="change">Change Password</button>
        </div>
      </form>
    </div>
    <script>
      document.querySelector("#change").addEventListener("click", async () => {
        const password = document.querySelector("#password").value;
        const access_token = new URLSearchParams(window.location.search).get(
          "access_token"
        );

        if (password && access_token) {
          const response = await fetch(
            "${process.env.API_URL}/users/changepassfromrecover/" +
              password +
              "?access_token=" +
              access_token,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            alert("Password successfully changed!");
            window.location = "${process.env.FRONT_URL}/";
          } else {
            alert("Unable to change password. Please try again.");
          }
        } else {
          alert("Please enter a password.");
        }
      });
    </script>
  </body>
</html>

`;
            return html;
        }
        catch (error) {
            console.log(error);
            var html = `Errore`;
            return html;
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
            const response = await this.usersRepository.findOne({
                where: { email: payLoad.email },
            });
            if (!response) {
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'User not found',
                    data: null,
                };
            }
            if (response && response.nonce === payLoad.nonce) {
                const newNonce = (0, crypto_1.randomBytes)(16).toString('hex');
                response.nonce = newNonce;
                response.password = encrypt(newPassword);
                await this.usersRepository.update({ email: payLoad.email }, response);
                const response2 = await this.usersRepository.findOne({
                    where: { email: payLoad.email },
                });
                const data = new users_dto_1.UsersResponse(response2);
                return {
                    statusCode: common_1.HttpStatus.OK,
                    message: 'Password changed successfully',
                    data,
                };
            }
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Invalid token',
                data: null,
            };
        }
        catch (error) {
            console.log(error);
            return {
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to change password',
                data: null,
            };
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], UsersService);
//# sourceMappingURL=users.service.js.map