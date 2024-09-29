import * as jwt from "jsonwebtoken";
import { InvalidCredentialsError } from '../../errors/InvalidCredentialsError';
import {SessionStrategy} from "./SessionStrategy";
import {UserService} from "../../user/UserService";
import { JWT_SECRET, JWT_EXPIRATION_TIME } from "../../../../utils/config";
import {Encrypter} from "../../../../utils/encrypter/Encrypter";
import {inject, injectable} from "tsyringe";
import {User} from "../../../domain/User";

const INVALID_CREDS_MSG = "Invalid credentials.";

@injectable()
export class TokenSessionStrategy implements SessionStrategy {
    private encrypter: Encrypter;

    constructor(@inject("Encrypter") encrypter: Encrypter) {
        this.encrypter = encrypter;
    }

    /**
     * @inheritDoc
     */
    public logIn = async (id: string, password: string, userService: UserService): Promise<string> => {
        if(id) throw new Error("error prueba");

        const user = await userService.getUserById(id);

        if (user == null) throw new InvalidCredentialsError(INVALID_CREDS_MSG);
        if (!this.encrypter.compareEncryptedString(user.getPassword(), password)) throw new InvalidCredentialsError(INVALID_CREDS_MSG);

        return this.generateTokenForUser(user);
    }

    public async logInFederated(id: string, userService: UserService): Promise<string> {
        const user = await userService.getUserById(id);

        if (user == null) throw new InvalidCredentialsError(INVALID_CREDS_MSG);
        return this.generateTokenForUser(user);
    }

    /**
     * @function generateTokenForUser
     * @description Generates a token for the provided user.
     *
     * @param {User} user - The user object for which to generate the JWT token.
     * @returns {string} A unique token for the user.
     */
    private generateTokenForUser = (user: User): string => {
        return jwt.sign({userId: user.getId()}, (JWT_SECRET as string), {expiresIn: JWT_EXPIRATION_TIME});
    }
}