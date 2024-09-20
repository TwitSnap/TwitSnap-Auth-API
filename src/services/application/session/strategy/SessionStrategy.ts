export interface SessionStrategy {
    /**
     * Logs the user in.
     * @param logInData - The data of the user to log in.
     * @param userService - The UserService instance.
     * @returns A promise that resolves with the result of the login operation.
     */
    logIn(logInData: any, userService: any): Promise<any>;
    //TODO Quitar el any
}