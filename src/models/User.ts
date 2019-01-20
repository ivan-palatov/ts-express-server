import bcrypt = require("bcrypt");
import limax = require("limax");
import * as paginate from "mongoose-paginate";
import mongooseSlugPlugin = require("mongoose-slug-plugin");
import { instanceMethod, InstanceType, plugin, pre, prop, Typegoose } from "typegoose";
// tslint:disable-next-line
import uuidv4 = require("uuid/v4");

import { IPaginateOptions, IPaginateResult } from "../utils/interfaces";

enum Gender {
  MALE = "male",
  FEMALE = "female"
}

type callback = (err: any, isMatch: boolean) => any;

@pre<User>("save", function(next) {
  if (!this.isModified("password")) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next();
    bcrypt.hash(this.password, salt, (error, hash) => {
      if (error) return next();
      this.password = hash;
      next();
    });
  });
})
@plugin(paginate)
@plugin(mongooseSlugPlugin, { tmpl: "<%=name%>", slug: limax, histoyField: "slugHistory" })
class User extends Typegoose {
  static paginate: (
    query?: object,
    options?: IPaginateOptions,
    callback?: (err: any, result: IPaginateResult<User>) => void
  ) => Promise<IPaginateResult<User>>;

  slug: string;
  slugHistory: string[];

  @prop({ unique: true, index: true, required: true })
  name: string;

  @prop({ unique: true, index: true, required: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop()
  age?: number;

  @prop({ enum: Gender })
  gender: Gender;

  @prop()
  dateOfBirth: Date;

  @prop({ default: false })
  isActive: boolean;

  @prop({ default: uuidv4() })
  activationCode: string;

  @instanceMethod
  validatePassword(this: InstanceType<User>, pw: string, done: callback): void {
    bcrypt.compare(pw, this.password, (err, isMatch) => {
      done(err, isMatch);
    });
  }
}

const userModel = new User().getModelForClass(User, { schemaOptions: { timestamps: true } });
export { userModel as User };
