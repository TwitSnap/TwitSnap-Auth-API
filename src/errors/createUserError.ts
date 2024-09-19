export class CreateUserError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CreateUserError.prototype)
    }
}