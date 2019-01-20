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
    validatePassword(pw, done) {
        bcrypt.compare(pw, this.password, (err, isMatch) => {
            done(err, isMatch);
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
    typegoose_1.prop(),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
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
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", void 0)
], User.prototype, "validatePassword", null);
User = __decorate([
    typegoose_1.pre("save", function (next) {
        if (!this.isModified("password"))
            return next();
        bcrypt.genSalt(10, (err, salt) => {
            if (err)
                return next();
            bcrypt.hash(this.password, salt, (error, hash) => {
                if (error)
                    return next();
                this.password = hash;
                next();
            });
        });
    }),
    typegoose_1.plugin(paginate),
    typegoose_1.plugin(mongooseSlugPlugin, { tmpl: "<%=name%>", slug: limax, histoyField: "slugHistory" })
], User);
const userModel = new User().getModelForClass(User, { schemaOptions: { timestamps: true } });
exports.User = userModel;
//# sourceMappingURL=User.js.map