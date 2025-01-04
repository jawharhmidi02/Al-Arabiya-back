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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admins_service_1 = require("../services/admins.service");
const users_dto_1 = require("../dto/users.dto");
const categories_dto_1 = require("../dto/categories.dto");
const brands_dto_1 = require("../dto/brands.dto");
const products_dto_1 = require("../dto/products.dto");
const orders_dto_1 = require("../dto/orders.dto");
const specialOffers_dto_1 = require("../dto/specialOffers.dto");
const customizations_dto_1 = require("../dto/customizations.dto");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async SignIn(email, password) {
        return await this.adminService.signin(email, password);
    }
    async getAccount(admin_access_token) {
        return await this.adminService.getAccount(admin_access_token);
    }
    async sendRecoverPass(email) {
        return await this.adminService.sendRecoverPassViaEmail(email.toLowerCase());
    }
    async changePasswordFromRecover(admin_access_token, password) {
        return await this.adminService.changePasswordFromRecover(admin_access_token, password);
    }
    async getRecoverPassHtml(admin_access_token) {
        return await this.adminService.recoverPageHtml(admin_access_token);
    }
    async findAllUser(page, limit, sort = 'created_At', order = 'ASC', search = '', admin_access_token) {
        return await this.adminService.findAllUser(page, limit, sort, order, search, admin_access_token);
    }
    async findByIdUser(id, admin_access_token) {
        return await this.adminService.findByIdUser(id, admin_access_token);
    }
    async updateUser(id, admin_access_token, user) {
        return await this.adminService.updateUser(id, user, admin_access_token);
    }
    async deleteUser(id, admin_access_token) {
        return await this.adminService.deleteUser(id, admin_access_token);
    }
    async createCategory(categoryDto, admin_access_token) {
        return await this.adminService.createCategory(categoryDto, admin_access_token);
    }
    async findAllCategory(page, limit, name, admin_access_token) {
        return await this.adminService.findAllCategory(page, limit, name, admin_access_token);
    }
    async findByIdCategory(id, admin_access_token) {
        return await this.adminService.findByIdCategory(id, admin_access_token);
    }
    async findByNameCategory(name, admin_access_token) {
        return await this.adminService.findByNameCategory(name, admin_access_token);
    }
    async updateCategory(id, category, admin_access_token) {
        return await this.adminService.updateCategory(id, category, admin_access_token);
    }
    async deleteCategory(id, admin_access_token) {
        return await this.adminService.deleteCategory(id, admin_access_token);
    }
    async createBrand(brandDto, admin_access_token) {
        return await this.adminService.createBrand(brandDto, admin_access_token);
    }
    async findAllBrand(page, limit, name, admin_access_token) {
        return await this.adminService.findAllBrand(page, limit, name, admin_access_token);
    }
    async findByIdBrand(id, admin_access_token) {
        return await this.adminService.findByIdBrand(id, admin_access_token);
    }
    async findByNameBrand(name, admin_access_token) {
        return await this.adminService.findByNameBrand(name, admin_access_token);
    }
    async updateBrand(id, brand, admin_access_token) {
        return await this.adminService.updateBrand(id, brand, admin_access_token);
    }
    async deleteBrand(id, admin_access_token) {
        return await this.adminService.deleteBrand(id, admin_access_token);
    }
    async createProduct(productDto, admin_access_token) {
        return await this.adminService.createProduct(productDto, admin_access_token);
    }
    async createByListProduct(productDto, admin_access_token) {
        return await this.adminService.createByListProduct(productDto, admin_access_token);
    }
    async findAllProduct(page, limit, name, admin_access_token) {
        return await this.adminService.findAllProduct(page, limit, name, admin_access_token);
    }
    async findByIdProduct(id, admin_access_token) {
        return await this.adminService.findByIdProduct(id, admin_access_token);
    }
    async findByNameProduct(name, admin_access_token) {
        return await this.adminService.findByNameProduct(name, admin_access_token);
    }
    async findMostPopularProduct(page, limit, admin_access_token) {
        return await this.adminService.findMostPopularProduct(page, limit, admin_access_token);
    }
    async searchProduct(page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc', admin_access_token, name, categories, brand, min_price, max_price) {
        return await this.adminService.searchProduct(page, limit, sortBy, sortOrder, {
            name,
            categories,
            brand,
            min_price,
            max_price,
        }, admin_access_token);
    }
    async updateProduct(id, product, admin_access_token) {
        return await this.adminService.updateProduct(id, product, admin_access_token);
    }
    async deleteProduct(id, admin_access_token) {
        return await this.adminService.deleteProduct(id, admin_access_token);
    }
    async createOrder(orderDto, admin_access_token) {
        return await this.adminService.createOrder(orderDto, admin_access_token);
    }
    async findAllOrder(page, limit, sort = 'created_At', order = 'ASC', search = '', state = '', admin_access_token) {
        return await this.adminService.findAllOrder(page, limit, sort, order, search, state, admin_access_token);
    }
    async findByIdOrder(id, admin_access_token) {
        return await this.adminService.findByIdOrder(id, admin_access_token);
    }
    async updateOrder(id, order, admin_access_token) {
        return await this.adminService.updateOrder(id, order, admin_access_token);
    }
    async deleteOrder(id, admin_access_token) {
        return await this.adminService.deleteOrder(id, admin_access_token);
    }
    async createSpecialOffer(specialOfferDto, admin_access_token) {
        return await this.adminService.createSpecialOffer(specialOfferDto, admin_access_token);
    }
    async findAllSpecialOffer(page, limit, admin_access_token) {
        return await this.adminService.findAllSpecialOffer(page, limit, admin_access_token);
    }
    async findByIdSpecialOffer(id, admin_access_token) {
        return await this.adminService.findByIdSpecialOffer(id, admin_access_token);
    }
    async updateSpecialOffer(id, specialOffer, admin_access_token) {
        return await this.adminService.updateSpecialOffer(id, specialOffer, admin_access_token);
    }
    async deleteSpecialOffer(id, admin_access_token) {
        return await this.adminService.deleteSpecialOffer(id, admin_access_token);
    }
    async createCustomization(customizationDto, admin_access_token) {
        return await this.adminService.createCustomization(customizationDto, admin_access_token);
    }
    async findCustomization(admin_access_token) {
        return await this.adminService.findCustomization(admin_access_token);
    }
    async findByIdCustomization(id, admin_access_token) {
        return await this.adminService.findByIdCustomization(id, admin_access_token);
    }
    async updateCustomization(id, customization, admin_access_token) {
        return await this.adminService.updateCustomization(id, customization, admin_access_token);
    }
    async deleteCustomization(id, admin_access_token) {
        return await this.adminService.deleteCustomization(id, admin_access_token);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('/signin/'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "SignIn", null);
__decorate([
    (0, common_1.Get)('/account'),
    __param(0, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAccount", null);
__decorate([
    (0, common_1.Post)('/recoverpass/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "sendRecoverPass", null);
__decorate([
    (0, common_1.Post)('/changepassfromrecover/:password'),
    __param(0, (0, common_1.Query)('admin_access_token')),
    __param(1, (0, common_1.Param)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "changePasswordFromRecover", null);
__decorate([
    (0, common_1.Get)('/recoverhtml'),
    __param(0, (0, common_1.Query)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRecoverPassHtml", null);
__decorate([
    (0, common_1.Get)('/user'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('sort')),
    __param(3, (0, common_1.Query)('order')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAllUser", null);
__decorate([
    (0, common_1.Get)('/user/byid/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findByIdUser", null);
__decorate([
    (0, common_1.Put)('/user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, users_dto_1.UsersUpdate]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('/user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)('/category'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [categories_dto_1.CategoryCreate, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('/category'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('name')),
    __param(3, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAllCategory", null);
__decorate([
    (0, common_1.Get)('/category/byid/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findByIdCategory", null);
__decorate([
    (0, common_1.Get)('/category/byname/:name'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findByNameCategory", null);
__decorate([
    (0, common_1.Put)('/category/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, categories_dto_1.CategoryUpdate, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('/category/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Post)('/brand'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [brands_dto_1.BrandCreate, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createBrand", null);
__decorate([
    (0, common_1.Get)('/brand'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('name')),
    __param(3, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAllBrand", null);
__decorate([
    (0, common_1.Get)('/brand/byid/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findByIdBrand", null);
__decorate([
    (0, common_1.Get)('/brand/byname/:name'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findByNameBrand", null);
__decorate([
    (0, common_1.Put)('/brand/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, brands_dto_1.BrandUpdate, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateBrand", null);
__decorate([
    (0, common_1.Delete)('/brand/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteBrand", null);
__decorate([
    (0, common_1.Post)('/product'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [products_dto_1.ProductCreate, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Post)('/product/list'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createByListProduct", null);
__decorate([
    (0, common_1.Get)('/product'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('name')),
    __param(3, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAllProduct", null);
__decorate([
    (0, common_1.Get)('/product/byid/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findByIdProduct", null);
__decorate([
    (0, common_1.Get)('/product/byname/:name'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findByNameProduct", null);
__decorate([
    (0, common_1.Get)('/product/mostpopular'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findMostPopularProduct", null);
__decorate([
    (0, common_1.Get)('/product/search'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Headers)('admin_access_token')),
    __param(5, (0, common_1.Query)('name')),
    __param(6, (0, common_1.Query)('categories')),
    __param(7, (0, common_1.Query)('brand')),
    __param(8, (0, common_1.Query)('min_price')),
    __param(9, (0, common_1.Query)('max_price')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "searchProduct", null);
__decorate([
    (0, common_1.Put)('/product/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, products_dto_1.ProductUpdate, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('/product/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Post)('/order'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [orders_dto_1.OrderCreate, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('/order'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('sort')),
    __param(3, (0, common_1.Query)('order')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('state')),
    __param(6, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAllOrder", null);
__decorate([
    (0, common_1.Get)('/order/byid/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findByIdOrder", null);
__decorate([
    (0, common_1.Put)('/order/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, orders_dto_1.OrderUpdate, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateOrder", null);
__decorate([
    (0, common_1.Delete)('/order/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteOrder", null);
__decorate([
    (0, common_1.Post)('/specialOffer'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [specialOffers_dto_1.SpecialOfferCreate, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createSpecialOffer", null);
__decorate([
    (0, common_1.Get)('/specialOffer'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAllSpecialOffer", null);
__decorate([
    (0, common_1.Get)('/specialOffer/byid/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findByIdSpecialOffer", null);
__decorate([
    (0, common_1.Put)('/specialOffer/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, specialOffers_dto_1.SpecialOfferUpdate, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateSpecialOffer", null);
__decorate([
    (0, common_1.Delete)('/specialOffer/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteSpecialOffer", null);
__decorate([
    (0, common_1.Post)('/customization'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customizations_dto_1.CustomizationCreate, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createCustomization", null);
__decorate([
    (0, common_1.Get)('/customization'),
    __param(0, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findCustomization", null);
__decorate([
    (0, common_1.Get)('/customization/byid/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findByIdCustomization", null);
__decorate([
    (0, common_1.Put)('/customization/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, customizations_dto_1.CustomizationUpdate, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCustomization", null);
__decorate([
    (0, common_1.Delete)('/customization/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('admin_access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteCustomization", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admins'),
    __metadata("design:paramtypes", [admins_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admins.controller.js.map