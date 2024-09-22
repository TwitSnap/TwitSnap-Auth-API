import { InvalidTokenError } from './errors/InvalidTokenError';
import { JWT_SECRET } from '../../utils/config';
import { SessionService } from './../../services/application/session/SessionService';
import { UserService } from './../../services/application/user/UserService';
import { ResolverStrategy } from "./ResolverStrategy";

const jwt = require("jsonwebtoken");


export class NormalResolverStrategy implements ResolverStrategy<string>{
    public  LogIn = async (email:string, password:string, sessionService: SessionService ):Promise<string> => {
        return await sessionService.login(email, password);
    }

    public Register = async (id:string, password:string, userService:UserService) =>{
        return await userService.register(id, password);
    }

    public Authenticate = (token:string) => {
        try{
            jwt.verify(token,JWT_SECRET);
        }
        catch (e){
            throw new InvalidTokenError("Invalid token error");
        }

    }
}