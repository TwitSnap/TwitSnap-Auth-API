import {UserRepository} from "../../../interfaces/UserRepository";
import {TypeORMRepository} from "../TypeORMRepository";
import {User} from "../../../../../services/domain/User";

export class TypeORMUserRepository extends TypeORMRepository<User> implements UserRepository {
    constructor() {
        super(User);
    }

    async getById(id: string): Promise<User | null> {
        try {
            return await this.typeOrmRepository.createQueryBuilder("User")
                .where("user.id = :id", {id})
                .getOne();
        } catch (error: any) {
            throw new StandardDatabaseError(error.message);
        }
    }

    async save(user: User): Promise<User> {
        try {
            return this.typeOrmRepository.save(user);
        } catch (error: any) {
            throw new StandardDatabaseError(error.message);
        }
    }
}