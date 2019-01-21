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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const limax = require("limax");
const paginate = require("mongoose-paginate");
const mongooseSlugPlugin = require("mongoose-slug-plugin");
const typegoose_1 = require("typegoose");
// tslint:disable-next-line
const uuidv4 = require("uuid/v4");
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
})(Gender || (Gender = {}));
let User = class User extends typegoose_1.Typegoose {
    static getBySlug(slug) {
        return this.findOne({ slug });
    }
    validatePassword(pw) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield bcrypt.compare(pw, this.password);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
};
__decorate([
    typegoose_1.prop({ unique: true, index: true, required: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    typegoose_1.prop({ unique: true, index: true, required: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typegoose_1.prop({ enum: Gender }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Date)
], User.prototype, "dateOfBirth", void 0);
__decorate([
    typegoose_1.prop({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    typegoose_1.prop({ default: uuidv4() }),
    __metadata("design:type", String)
], User.prototype, "activationCode", void 0);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], User.prototype, "validatePassword", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], User, "getBySlug", null);
User = __decorate([
    typegoose_1.pre("save", function (next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isModified("password"))
                return next();
            try {
                const salt = yield bcrypt.genSalt(10);
                const hash = yield bcrypt.hash(this.password, salt);
                this.password = hash;
                next();
            }
            catch (error) {
                return next(error);
            }
        });
    }),
    typegoose_1.plugin(paginate),
    typegoose_1.plugin(mongooseSlugPlugin, {
        tmpl: "<%=name%>",
        slug: limax,
        slugOptions: { separateNumbers: false },
        historyField: "slugHistory"
    })
], User);
const userModel = new User().getModelForClass(User, { schemaOptions: { timestamps: true } });
exports.User = userModel;
//# sourceMappingURL=User.js.map