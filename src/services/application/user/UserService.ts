import {User} from "../../domain/User";
import {UserRepository} from "../../../db/repositories/interfaces/UserRepository";
import {Encrypter} from "../../../utils/encrypter/Encrypter";
import {inject, injectable} from "tsyringe";
import {InvalidRegisterCredentialsError} from "../errors/InvalidRegisterCredentialsError";
import {logger} from "../../../utils/container/container";
import {TwitSnapAPIs} from "../../../api/external/TwitSnapAPIs";
import {Helpers} from "../../../utils/helpers";
import {JWT_NEW_PASSWORD, JWT_NEW_PASSWORD_EXPIRATION_TIME,} from "../../../utils/config";
import {InvalidCredentialsError} from "../errors/InvalidCredentialsError";

const PASSWORD_MIN_LENGTH = 8;

@injectable()
export class UserService {
    userRepository: UserRepository;
    encrypter: Encrypter;
    twitSnapAPIs: TwitSnapAPIs;

    constructor(@inject("UserRepository") userRepository: UserRepository, @inject("Encrypter") encrypter: Encrypter, twitSnapAPIs: TwitSnapAPIs) {
        this.userRepository = userRepository;
        this.encrypter = encrypter;
        this.twitSnapAPIs = twitSnapAPIs;
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
        if (await this.userIsRegistered(id)) throw new InvalidRegisterCredentialsError("User already exists.");
        
        if (password.length < PASSWORD_MIN_LENGTH) throw new InvalidRegisterCredentialsError("Password must be at least 8 characters long.");
    }

    private async userIsRegistered(id: string): Promise<boolean> {
        return (await this.getUserById(id) != null);
    }

    /**
     * Retrieves a user by its id.
     * @returns The user with the given id, or null if no user was found.
     */
    public async getUserById(id: string): Promise<User | null> {
        return this.userRepository.getById(id);
    }

    public async forgotPassword(email: string): Promise<void> {
        logger.logDebugFromEntity("Received request to reset password for user with email: " + email, this.constructor);

        // ? Obtenemos ID del usuario a partir del email
        const userId = await this.twitSnapAPIs.getUserIdFromUserEmail(email);
        logger.logDebugFromEntity("User found with email: " + email, this.constructor);

        // ? Verificamos que sea un usuario registrado via TwitSnap y no via Google u otro servicio.
        if (!await this.userIsRegistered(userId)) {
            logger.logErrorFromEntity("User with email: " + email + " is not a TwitSnap user.", this.constructor);
            throw new InvalidCredentialsError("Invalid credentials.")
        }
        logger.logDebugFromEntity("User with email: " + email + " is a TwitSnap user.", this.constructor);

        // ? Enviar notificación de cambio de contraseña
        const token = Helpers.generateToken({userId: userId}, (JWT_NEW_PASSWORD as string), JWT_NEW_PASSWORD_EXPIRATION_TIME as string);
        logger.logDebugFromEntity("Password reset token generated successfully. Sending notification to user with email: " + email, this.constructor);
        return await this.twitSnapAPIs.sendResetPasswordNotification([email], token);
    }
}