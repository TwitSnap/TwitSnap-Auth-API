import {DatabaseConnectorStrategy} from "./DatabaseConnectorStrategy";
import {DataSource} from "typeorm";
import {AppDataSource} from "./dataSource";

/**
 * Concrete implementation of the `DatabaseConnectorStrategy` interface for TypeORM.
 *
 * This class provides methods for initializing the TypeORM connection and retrieving
 * the data source instance. It uses a `readonly` instance of `DataSource` to manage
 * the database connection.
 */
export class TypeORMDatabaseConnectorStrategy implements DatabaseConnectorStrategy<DataSource, DataSource> {
    private readonly _instance: DataSource;

    constructor() {
        this._instance = AppDataSource;
    }

    /**
     * Initializes the database connection.
     *
     * This method uses the `_instance` to initialize the TypeORM connection and
     * returns a promise that resolves with the initialized `DataSource`.
     *
     * @returns {Promise<DataSource>} A promise that resolves with the initialized `DataSource`.
     */
    public initializeConnection = async (): Promise<DataSource> => {
        return this.instance.initialize();
    };

    /**
     * Gets the `DataSource` instance.
     *
     * This method returns the `readonly` `_instance` of `DataSource`.
     *
     * @returns {DataSource} The `readonly` `DataSource` instance.
     */
    private get instance(): DataSource {
        return this._instance;
    }

    /**
     * Retrieves the `DataSource`.
     *
     * This method returns the `DataSource` instance used for database interactions.
     *
     * @returns {DataSource} The `DataSource` for database interactions.
     */
    public getDataSource = (): DataSource => {
        return this.instance;
    };

    /**
     * Shuts down the database connection.
     *
     * This method should handle the process of closing the database connection
     * and return a promise that resolves when the shutdown is complete.
     *
     * @returns {Promise<void>} A promise that resolves when the connection has been shut down.
     */
    public shutdownConnection = (): Promise<void> => {
        return this.instance.destroy();
    };
}
