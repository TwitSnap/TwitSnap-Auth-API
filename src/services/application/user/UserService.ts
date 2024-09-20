import {User} from "../../domain/User";
import {UserRepository} from "../../../db/repositories/interfaces/UserRepository";
import {Encrypter} from "../../../utils/encrypter/Encrypter";
import {autoInjectable} from "tsyringe";

@autoInjectable()
export class UserService {
    userRepository: UserRepository;
    encrypter: Encrypter;

    constructor(userRepository: UserRepository, encrypter: Encrypter) {
        this.userRepository = userRepository;
        this.encrypter = encrypter;
    }

    public async register(id: string, password: string): Promise<User> {
        this.validateRegisterData(id, password);
        password = this.encrypter.encryptString(password);

        const user = new User(id, password);
        return this.userRepository.save(user);
    }

    private validateRegisterData(id: string, password: string): void {
        //TODO No debe ser un literal y faltan errores custom
        if (this.userRepository.getById(id) != null) throw new Error("User already exists");
        if (password.length < 8) throw new Error("Password must be at least 8 characters long");
    }
}