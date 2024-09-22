export class UnknownTypeError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, UnknownTypeError.prototype);
    }
}