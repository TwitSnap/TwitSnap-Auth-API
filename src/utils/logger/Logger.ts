import {LoggingStrategy} from "./LoggingStrategy";
import {inject, injectable} from "tsyringe";

/**
 * Logger class that uses a logging strategy to log messages.
 * The strategy can be changed to use different logging implementations.
 */
@injectable()
export class Logger {
    private _loggingStrategy: LoggingStrategy;
    private readonly _logging: boolean;
    private readonly _logDebug: boolean;
    private readonly _logError: boolean;
    private readonly _logInfo: boolean;

    constructor
    (
        @inject("LoggingStrategy") loggingStrategy: LoggingStrategy,
        @inject("logging") logging: boolean = true,
        @inject("logDebug") logDebug: boolean = true,
        @inject("logError") logError: boolean = true,
        @inject("logInfo") logInfo: boolean = true
    ) {
        this._loggingStrategy = loggingStrategy;
        this._logging = logging;
        this._logDebug = logDebug;
        this._logError = logError;
        this._logInfo = logInfo;
    }

    /**
     * Logs an informational message using the current logging strategy.
     *
     * @param message - The informational message to log.
     */
    public logInfo = (message: string): void => {
        if (this.logInfoIsEnabled()) this._loggingStrategy.logInfo(message);
    }

    /**
     * Logs an error message using the current logging strategy.
     *
     * @param message - The error message to log.
     */
    public logError = (message: string): void => {
        if (this.logErrorIsEnabled()) this._loggingStrategy.logError(message);
    }

    /**
     * Logs a debug message using the current logging strategy.
     *
     * @param message - The debug message to log.
     */
    public logDebug = (message: string): void => {
        if (this.logDebugIsEnabled()) this._loggingStrategy.logDebug(message);
    }

    /**
     * Returns whether info logging is enabled.
     * @returns True if logging and info logging is enabled, false otherwise.
     * */
    private logInfoIsEnabled = (): boolean => {
        return this._logging && this._logInfo;
    }

    /**
     * Returns whether error logging is enabled.
     * @returns True if logging and error logging is enabled, false otherwise.
     * */
    private logErrorIsEnabled = (): boolean => {
        return this._logging && this._logError;
    }

    /**
     * Returns whether debug logging is enabled.
     * @returns True if logging and debug logging is enabled, false otherwise.
     * */
    private logDebugIsEnabled = (): boolean => {
        return this._logging && this._logDebug;
    }
}