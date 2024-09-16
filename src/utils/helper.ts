import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
export class encrypt {
  static async encryptpass(password: string) {
    if (password){
        return bcrypt.hashSync(password, 12);
    }

    return password;
        
  }
  static comparepassword(hashPassword: string, password: string) {
    return bcrypt.compareSync(password, hashPassword);
  }

  static generateToken(payload: String) {
    return jwt.sign({userId: payload},JWT_SECRET, { expiresIn: "1d" });
  }
}