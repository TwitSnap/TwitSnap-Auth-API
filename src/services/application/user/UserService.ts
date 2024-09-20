import {User} from "../../domain/User";
import {UserRepository} from "../../../db/repositories/interfaces/UserRepository";
import {TypeORMUserRepository} from "../../../db/repositories/impls/TypeORM/user/TypeORMUserRepository";
import {Encrypter} from "../../../utilss/encrypter/Encrypter";
import {BcryptEncrypter} from "../../../utilss/encrypter/BcryptEncrypter";

export class UserService {
    userRepository: UserRepository;
    encrypter: Encrypter;

    constructor() {
        this.userRepository = new TypeORMUserRepository();
        this.encrypter = new BcryptEncrypter();
    }

    public async register(id: string, password: string): Promise<User> {
        this.validateRegisterData(id, password);
        password = this.encrypter.encryptString(password);

        const user = new User(id, password);
        return this.userRepository.save(user);
    }

    private validateRegisterData(id: string, password: string): void {
        //TODO No debe ser un literal y faltan errores custom
        if (id.length < 8) throw new Error("ID must be at least 8 characters long");
        if (password.length < 8) throw new Error("Password must be at least 8 characters long");
    }
}