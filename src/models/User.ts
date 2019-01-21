import bcrypt = require("bcrypt");
import limax = require("limax");
import * as paginate from "mongoose-paginate";
import mongooseSlugPlugin = require("mongoose-slug-plugin");
import {
  instanceMethod,
  InstanceType,
  ModelType,
  plugin,
  pre,
  prop,
  staticMethod,
  Typegoose
} from "typegoose";
// tslint:disable-next-line
import uuidv4 = require("uuid/v4");

import { IPaginateOptions, IPaginateResult } from "../utils/interfaces";

enum Gender {
  MALE = "male",
  FEMALE = "female"
}

@pre<User>("save", async function(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
})
@plugin(paginate)
@plugin(mongooseSlugPlugin, {
  tmpl: "<%=name%>",
  slug: limax,
  slugOptions: { separateNumbers: false },
  historyField: "slugHistory"
})
class User extends Typegoose {
  static paginate: (
    query?: object,
    options?: IPaginateOptions,
    callback?: (err: any, result: IPaginateResult<User>) => void
  ) => Promise<IPaginateResult<User>>;

  @staticMethod
  static getBySlug(this: ModelType<User>, slug: string) {
    return this.findOne({ slug });
  }

  slug: string;
  slugHistory: string[];

  @prop({ unique: true, index: true, required: true })
  name: string;

  @prop({ unique: true, index: true, required: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop({ enum: Gender })
  gender: Gender;

  @prop()
  dateOfBirth: Date;

  @prop({ default: false })
  isActive: boolean;

  @prop({ default: uuidv4() })
  activationCode: string;

  @instanceMethod
  async validatePassword(this: InstanceType<User>, pw: string): Promise<boolean> {
    try {
      return await bcrypt.compare(pw, this.password);
    } catch (error) {
      throw new Error(error);
    }
  }
}

const userModel = new User().getModelForClass(User, { schemaOptions: { timestamps: true } });
export { userModel as User };
