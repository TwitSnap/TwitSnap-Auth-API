import { UserRepository } from "../../../interfaces/UserRepository";
import { TypeORMRepository } from "../TypeORMRepository";
import { User } from "../../../../../services/domain/User";
import { StandardDatabaseError } from "../../../../errors/StandardDatabaseError";

export class TypeORMUserRepository extends TypeORMRepository<User> implements UserRepository {
    constructor() {
        super(User);
    }

    /**
     * @inheritDoc
     */
    getById = async (id: string): Promise<User | null> => {
        try {
            return await this.typeOrmRepository.createQueryBuilder("user")
            .where("user.id = :id", { id })
            .getOne();
        } catch (error: any) {
            throw new StandardDatabaseError(error.message);
        }
    };

    /**
     * @inheritDoc
     */
    save = async (user: User): Promise<User> => {
        try {
            return await this.typeOrmRepository.save(user);
        } catch (error: any) {
            throw new StandardDatabaseError(error.message);
        }
    };
}
