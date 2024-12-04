import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { UsersCreate, UsersResponse, UsersUpdate } from 'src/dto/users.dto';
import { JwtService } from '@nestjs/jwt';
import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { jwtConstants } from 'src/constants/jwt.constant';
import * as nodemailer from 'nodemailer';

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
export class UsersService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  async signup(user: UsersCreate): Promise<ApiResponse<UsersResponse>> {
    try {
      user.password = encrypt(user.password);
      const response = await this.usersRepository.save(user);
      const data = new UsersResponse(response);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User signed up successfully',
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

  async signin(
    email: string,
    password: string,
  ): Promise<ApiResponse<{ access_token: string }>> {
    try {
      const response = await this.usersRepository.findOne({ where: { email } });
      if (!response || decrypt(response.password) !== password) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
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
        statusCode: HttpStatus.OK,
        message: 'Sign-in successful',
        data: { access_token: accessToken },
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

  async findAll(access_token: string): Promise<ApiResponse<UsersResponse[]>> {
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

      const response = await this.usersRepository.find();
      const data = response.map((user) => new UsersResponse(user));

      return {
        statusCode: HttpStatus.OK,
        message: 'Users retrieved successfully',
        data,
      };
    } catch (error) {
      console.error(error.response);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve users',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(
    id: string,
    access_token: string,
  ): Promise<ApiResponse<UsersResponse>> {
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

  async update(
    id: string,
    user: UsersUpdate,
    access_token: string,
  ): Promise<ApiResponse<UsersResponse>> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token);

      const account = await this.usersRepository.findOne({
        where: { id: payLoad.id },
      });

      if (payLoad.id !== id && (!account || account.role !== 'admin')) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Unauthorized access',
          data: null,
        };
      }

      if (account.nonce !== payLoad.nonce) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
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
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to update user',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(
    id: string,
    access_token: string,
  ): Promise<ApiResponse<UsersResponse>> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token);

      const account = await this.usersRepository.findOne({
        where: { id: payLoad.id },
      });

      if (payLoad.id !== id && (!account || account.role !== 'admin')) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Unauthorized access',
          data: null,
        };
      }

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

  async sendRecoverPassViaEmail(email: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.usersRepository.findOne({
        where: { email },
      });
      if (!response) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Email not found',
          data: null,
        };
      }
      const access_token = await this.jwtService.signAsync(
        {
          id: response.id,
          email: email,
          nonce: response.nonce,
        },
        { expiresIn: '10m', secret: jwtConstants.secret },
      );

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
      console.log(error);

      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to send email',
        data: null,
      };
    }
  }

  async recoverPageHtml(access_token: string): Promise<string> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token, {
        secret: jwtConstants.secret,
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
    } catch (error) {
      console.log(error);
      var html = `Errore`;

      return html;
    }
  }

  async changePasswordFromRecover(
    access_token: string,
    newPassword: string,
  ): Promise<ApiResponse<UsersResponse>> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token, {
        secret: jwtConstants.secret,
      });

      if (!payLoad.email) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid token',
          data: null,
        };
      }

      const response = await this.usersRepository.findOne({
        where: { email: payLoad.email },
      });

      if (!response) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
          data: null,
        };
      }

      if (response && response.nonce === payLoad.nonce) {
        const newNonce = randomBytes(16).toString('hex');

        response.nonce = newNonce;
        response.password = encrypt(newPassword);

        await this.usersRepository.update({ email: payLoad.email }, response);

        const response2 = await this.usersRepository.findOne({
          where: { email: payLoad.email },
        });

        const data = new UsersResponse(response2);

        return {
          statusCode: HttpStatus.OK,
          message: 'Password changed successfully',
          data,
        };
      }
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid token',
        data: null,
      };
    } catch (error) {
      console.log(error);

      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to change password',
        data: null,
      };
    }
  }
}
