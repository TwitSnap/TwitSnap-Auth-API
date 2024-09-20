import {UserRepository} from "../../../interfaces/UserRepository";
import {TypeORMRepository} from "../TypeORMRepository";
import {User} from "../../../../../services/domain/User";

export class TypeORMUserRepository extends TypeORMRepository<User> implements UserRepository {
    async getById(id: string): Promise<User | null> {
        //TODO
        return null;
    }

    async save(user: User): Promise<User> {
        //TODO
        return user;
    }
}