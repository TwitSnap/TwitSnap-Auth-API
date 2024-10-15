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
import {InvalidCredentialsFormat} from "../errors/InvalidCredentialsFormat";
import {InvalidTokenError} from "jwt-decode";

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
        
        this.validatePassword(password);
    }

    /**
     * Checks if a user is registered.
     * @param id The user's id.
     * @return True if the user is registered, false otherwise.
     */
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

    /**
   * Initiates the password reset process for the user with the given email.
   * @param email The user's email address.
   * @throws InvalidCredentialsError if the user is not registered via TwitSnap.
   */
    public async forgotPassword(email: string): Promise<void> {
        logger.logDebugFromEntity("Received request to reset password for user with email: " + email, this.constructor);

        // ? Obtenemos ID del usuario a partir del email
        const userData = await this.twitSnapAPIs.getUserDataFromUserEmail(email);
        const userId = userData.uid;
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

    /**
     * Checks if a password reset token is valid.
     * @param token The password reset token.
     * @return True if the token is valid, false otherwise.
     */
    public async resetPasswordTokenIsValid(token: string): Promise<boolean> {
        logger.logDebugFromEntity("Received request to check if password reset token " + token + " is valid.", this.constructor);
        const isValid = await Helpers.tokenIsValid(token, JWT_NEW_PASSWORD as string);
        logger.logDebugFromEntity("Password reset token " + token + " is " + (isValid ? "valid" : "invalid"), this.constructor);
        return isValid;
    }

    /**
     * Updates the password for a user using a password reset token.
     * @param token The password reset token.
     * @param password The new password.
     * @throws InvalidTokenError if the token has expired.
     */
    public async updatePasswordWithToken(token: string, password: string): Promise<void> {
        logger.logDebugFromEntity("Received request to update password with token: " + token + ".", this.constructor);

        if (!await this.resetPasswordTokenIsValid(token)) throw new InvalidTokenError("Password reset token has expired.");
        const userId = await Helpers.getDataFromToken(token, "userId", JWT_NEW_PASSWORD as string);

        return this.updatePassword(userId, password);
    }

    /**
     * Updates the password for a user.
     * @param userId The user's id.
     * @param password The new password.
     */
    private async updatePassword(userId: string, password: string): Promise<void> {
        logger.logDebugFromEntity("Received request to update password for user with id: " + userId + ".", this.constructor);

        this.validateUpdatePasswordData(password);
        password = this.encrypter.encryptString(password);

        await this.userRepository.updateUserPassword(userId, password);
        logger.logDebugFromEntity("Password updated successfully for user with id: " + userId + ".", this.constructor);
    }

    /**
     * Validates the data for updating a user's password.
     * @param password The new password.
     * @throws InvalidCredentialsFormat if the password is too short.
     */
    private validateUpdatePasswordData(password: string): void {
        this.validatePassword(password);
    }

    private validatePassword(password: string): void {
        if (password.length < PASSWORD_MIN_LENGTH) throw new InvalidCredentialsFormat("Password must be at least 8 characters long.");
    }
}