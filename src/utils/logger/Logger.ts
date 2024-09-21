import {LoggingStrategy} from "./LoggingStrategy";
import {autoInjectable} from "tsyringe";

/**
 * Logger class that uses a logging strategy to log messages.
 * The strategy can be changed to use different logging implementations.
 */
@autoInjectable()
export class Logger {
    private _loggingStrategy: LoggingStrategy;
    private readonly _loggingEnabled: boolean;

    constructor(loggingStrategy: LoggingStrategy, loggingEnabled: boolean = true) {
        this._loggingStrategy = loggingStrategy;
        this._loggingEnabled = loggingEnabled;
    }

    /**
     * Logs an informational message using the current logging strategy.
     *
     * @param message - The informational message to log.
     */
    public logInfo = (message: string): void => {
        if (this._loggingEnabled) this._loggingStrategy.logInfo(message);
    }

    /**
     * Logs an error message using the current logging strategy.
     *
     * @param message - The error message to log.
     */
    public logError = (message: string): void => {
        if (this._loggingEnabled) this._loggingStrategy.logError(message);
    }
}