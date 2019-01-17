import bcrypt = require("bcrypt");
import * as paginate from "mongoose-paginate";
import { plugin, pre, prop, Typegoose } from "typegoose";

import { IPaginateOptions, IPaginateResult } from "../utils/interfaces";

enum Gender {
  MALE = "male",
  FEMALE = "female"
}

@pre<User>("save", function(next) {
  const pw = this.password;
  let passwordHash: string;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(pw, salt, (error, pwHash) => {
      passwordHash = pwHash;
    });
  });
  this.password = passwordHash;
  next();
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
}

const userModel = new User().getModelForClass(User);
export { userModel as User };
