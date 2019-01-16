import bcrypt = require("bcrypt");
import { InstanceType, ModelType, pre, prop, Typegoose } from "typegoose";

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

class User extends Typegoose {
  @prop({ unique: true, index: true, required: true })
  name: string;

  @prop({ unique: true, index: true, required: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop()
  age?: number;
}

const userModel = new User().getModelForClass(User);
export { userModel as User };
