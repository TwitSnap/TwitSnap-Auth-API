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

    /**
     * Registers a new user.
     * @param id The user's id.
     * @param password The user's password.
     * @return The created user.
     */
    public async register(id: string, password: string): Promise<User> {
        await this.validateRegisterData(id, password);
        password = this.encrypter.encryptString(password);

        const user = new User(id, password);
        return this.userRepository.save(user);
    }

    /**
     * Validates the data for a new user registration.
     * @param id The user's id.
     * @param password The user's password.
     * @throws InvalidCredentialsError if the user already exists or if the password is too short.
     */

    private async validateRegisterData(id: string, password: string):Promise<void> {
        let user = await this.userRepository.getById(id);
        if (user != null) throw new InvalidCredentialsError("User already exists");
        
        if (password.length < PASSWORD_MIN_LENGTH) throw new InvalidCredentialsError("Password must be at least 8 characters long");
    }
}