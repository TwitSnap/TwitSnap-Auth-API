import {UserService} from "../../user/UserService";

export interface SessionStrategy {
    /**
     * Logs the user in.
     * @param email
     * @param password
     * @param userService - The UserService instance.
     * @returns A promise that resolves with the result of the login operation.
     */
    logIn(email: string, password: string, userService: UserService): Promise<string>;
}