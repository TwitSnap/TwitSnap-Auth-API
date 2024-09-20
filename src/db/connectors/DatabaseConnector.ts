import {DatabaseConnectorStrategy} from "./DatabaseConnectorStrategy";
import {autoInjectable} from "tsyringe";
import {logger} from "../../utilss/container/container";

/**
 * A generic class that manages database connections using a specified strategy.
 *
 * This class uses a `DatabaseConnectorStrategy` to handle the database connection logic.
 * It provides methods to initialize the connection and retrieve the data source.
 *
 * @template T - Type of the database connection instance.
 * @template Y - Type of the data source.
 */
@autoInjectable()
export class DatabaseConnector<T, Y> {
    private _strategy: DatabaseConnectorStrategy<T, Y>

    constructor(strategy: DatabaseConnectorStrategy<T, Y>) {
        this._strategy = strategy;
    }

    /**
     * Initializes the database connection.
     *
     * This method calls the `initializeConnection` method of the strategy and logs the result.
     * It also handles and logs any errors that occur during the connection process.
     *
     * @returns {Promise<void>} A promise that resolves when the database connection is successfully initialized.
     * @throws {Error} Throws an error if the connection fails.
     */
    public initializeConnection = async (): Promise<void> => {
        return await this._strategy.initializeConnection().then(() => {
            console.log("Database connected");
            logger.logInfo("Database connected");
        } ).catch((error) => {
            console.log(`Failed to connect to database: ${error}`);
            logger.logError(`Failed to connect to database: ${error}`);

            throw error;
        });
    }

    /**
     * Retrieves the data source instance.
     *
     * This method returns the data source managed by the strategy.
     *
     * @returns {Y} The data source instance.
     */
    public getDataSource = (): Y => {
        return this._strategy.getDataSource();
    }

    /**
     * Shuts down the database connection.
     *
     * This method calls the `shutdownConnection` method of the strategy and logs the result.
     * It also handles and logs any errors that occur during the shutdown process.
     *
     * @returns {Promise<void>} A promise that resolves when the database connection is successfully closed.
     * @throws {Error} Throws an error if the shutdown fails.
     */
    public shutdownConnection = async (): Promise<void> => {
        return await this._strategy.shutdownConnection().then(() => {
            console.log("Database connection closed");
            logger.logInfo("Database connection closed");
        }).catch((error) => {
            console.log(`Failed to close database connection: ${error}`);
            logger.logError(`Failed to close database connection: ${error}`);

            throw error;
        });
    }
}