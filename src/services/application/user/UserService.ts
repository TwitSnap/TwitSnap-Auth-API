import {User} from "../../domain/User";
import {UserRepository} from "../../../db/repositories/interfaces/UserRepository";
import {Encrypter} from "../../../utils/encrypter/Encrypter";
import {inject, injectable} from "tsyringe";
import {InvalidCredentialsError} from "../errors/InvalidCredentialsError";

const PASSWORD_MIN_LENGTH = 8;

@injectable()
export class UserService {
    userRepository: UserRepository;
    encrypter: Encrypter;

    constructor(@inject("UserRepository") userRepository: UserRepository, @inject("Encrypter") encrypter: Encrypter) {
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
        if (this.userRepository.getById(id) != null) throw new InvalidCredentialsError("User already exists");
        if (password.length < PASSWORD_MIN_LENGTH) throw new InvalidCredentialsError("Password must be at least 8 characters long");
    }
}