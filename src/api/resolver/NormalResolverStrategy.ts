import { User } from './../../services/domain/User';
import { NormalLoginRequest } from './../../services/domain/Requests';
import { InvalidTokenError } from './errors/InvalidTokenError';
import { JWT_SECRET } from '../../utils/config';
import { SessionService } from './../../services/application/session/SessionService';
import { UserService } from './../../services/application/user/UserService';
import { ResolverStrategy } from "./ResolverStrategy";
import { Request, Response } from 'express';

const jwt = require("jsonwebtoken");


export class NormalResolverStrategy implements ResolverStrategy {


    public  LogIn = async (req:Request,res:Response, sessionService: SessionService ):Promise<string> => {

        return await sessionService.logIn(req.body.email, req.body.password);
    }

    public Register = async (id:string, password:string, userService:UserService): Promise<User> =>{
        return await userService.register(id, password);
    }

    public Authenticate = async (req:Request, res: Response): Promise<void> => {
        try{
            jwt.verify(req.body.token,JWT_SECRET);
        }
        catch (e){
            throw new InvalidTokenError("Invalid token error");
        }

    }
}