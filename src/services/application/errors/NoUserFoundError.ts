export class NoUserFoundsError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, NoUserFoundsError.prototype);
    }
}