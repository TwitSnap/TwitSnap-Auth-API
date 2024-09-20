import {User} from "../../../services/domain/User";

export interface UserRepository {
    /**
     * Retrieves a `User` entity by its unique identifier.
     *
     * @param id - The unique identifier of the User.
     * @returns A promise that resolves to the `User` entity if found, or `null` if not found.
     */
    getById(id: string): Promise<User | null>;

    /**
     * Saves a new or existing `User` entity to the storage.
     *
     * @param message - The `User` entity to be saved.
     * @returns A promise that resolves to the saved `User` entity.
     */
    save(message: User): Promise<User>;
}