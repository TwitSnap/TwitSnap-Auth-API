export class UserIsBannedError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, UserIsBannedError.prototype);
    }
}