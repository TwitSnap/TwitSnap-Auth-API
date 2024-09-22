import { UserService } from '../../services/application/user/UserService';
import { SessionService } from './../../services/application/session/SessionService';
export interface ResolverStrategy<T>{
    LogIn(email:string, password:string, sessionService: SessionService): Promise<T>;
    Register(id:string, password:string,userService: UserService):any;
    Authenticate(token:string):Promise<void>;
}