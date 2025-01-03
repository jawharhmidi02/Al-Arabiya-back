"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const common_1 = require("@nestjs/common");
const express_1 = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const port = process.env.PORT || 5000;
    app.use((0, express_1.json)({ limit: '50mb' }));
    app.use((0, express_1.urlencoded)({ limit: '50mb', extended: true }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
        disableErrorMessages: false,
        enableDebugMessages: true,
        validationError: {
            target: false,
            value: true,
        },
        exceptionFactory: (errors) => {
            const result = errors.map((error) => ({
                property: error.property,
                message: error.constraints ? Object.values(error.constraints) : [],
                value: error.value,
            }));
            return new common_1.BadRequestException(result);
        },
    }));
    app.enableCors({
        origin: ['https://al-arabiya.vercel.app', 'http://localhost:3000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    await app.listen(port);
    console.log(`Server is running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map