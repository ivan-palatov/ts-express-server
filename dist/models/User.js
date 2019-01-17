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
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const paginate = require("mongoose-paginate");
const typegoose_1 = require("typegoose");
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
})(Gender || (Gender = {}));
let User = class User extends typegoose_1.Typegoose {
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
    typegoose_1.prop(),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
__decorate([
    typegoose_1.prop({ enum: Gender, required: true }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
User = __decorate([
    typegoose_1.pre("save", function (next) {
        const pw = this.password;
        let passwordHash;
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(pw, salt, (error, pwHash) => {
                passwordHash = pwHash;
            });
        });
        this.password = passwordHash;
        next();
    }),
    typegoose_1.plugin(paginate)
], User);
const userModel = new User().getModelForClass(User);
exports.User = userModel;
//# sourceMappingURL=User.js.map