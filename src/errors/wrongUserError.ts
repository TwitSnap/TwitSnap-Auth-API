export class WrongUserError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, WrongUserError.prototype)
    }
}