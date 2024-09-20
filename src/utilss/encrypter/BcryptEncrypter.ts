import {Encrypter} from "./Encrypter";
import bcrypt from "bcryptjs";

export class BcryptEncrypter implements Encrypter {
    public encryptString(string: string): string {
        //TODO No debe ser un literal
        return bcrypt.hashSync(string, 12);
    }

    public compareEncryptedString(encrypted: string, nonEncrypted: string): boolean {
        return bcrypt.compareSync(nonEncrypted, encrypted);
    }
}