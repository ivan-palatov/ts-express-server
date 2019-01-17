import bcrypt = require("bcrypt");
import * as paginate from "mongoose-paginate";
import {
  instanceMethod,
  InstanceType,
  plugin,
  pre,
  prop,
  Typegoose
} from "typegoose";

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
class User extends Typegoose {
  static paginate: (
    query?: object,
    options?: IPaginateOptions,
    callback?: (err: any, result: IPaginateResult<User>) => void
  ) => Promise<IPaginateResult<User>>;

  @prop({ unique: true, index: true, required: true })
  name: string;

  @prop({ unique: true, index: true, required: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop()
  age?: number;

  @prop({ enum: Gender, required: true })
  gender: Gender;

  @instanceMethod
  validatePassword(this: InstanceType<User>, pw: string, done: callback): void {
    bcrypt.compare(pw, this.password, (err, isMatch) => {
      done(err, isMatch);
    });
  }
}

const userModel = new User().getModelForClass(User);
export { userModel as User };
