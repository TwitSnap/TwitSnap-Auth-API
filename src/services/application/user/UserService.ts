import {User} from "../../domain/User";
import {UserRepository} from "../../../db/repositories/interfaces/UserRepository";
import {Encrypter} from "../../../utils/encrypter/Encrypter";
import {inject, injectable} from "tsyringe";
import {InvalidRegisterCredentialsError} from "../errors/InvalidRegisterCredentialsError";
import {logger} from "../../../utils/container/container";

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
        logger.logDebugFromEntity(`Attempting to register user with id: ${id}`, this.constructor);

        await this.validateRegisterData(id, password);
        password = this.encrypter.encryptString(password);

        let user = new User(id, password);
        user = await this.userRepository.save(user);

        logger.logDebugFromEntity(`Attempt to register user with id ${id} was successful`, this.constructor);
        return user;
    }

    /**
     * Validates the data for a new user registration.
     * @param id The user's id.
     * @param password The user's password.
     * @throws InvalidCredentialsError if the user already exists or if the password is too short.
     */

    private async validateRegisterData(id: string, password: string):Promise<void> {
        let user = await this.getUserById(id);
        if (user != null) throw new InvalidRegisterCredentialsError("User already exists.");
        
        if (password.length < PASSWORD_MIN_LENGTH) throw new InvalidRegisterCredentialsError("Password must be at least 8 characters long.");
    }

    /**
     * Retrieves a user by its id.
     * @returns The user with the given id, or null if no user was found.
     */
    public async getUserById(id: string): Promise<User | null> {
        return this.userRepository.getById(id);
    }
}