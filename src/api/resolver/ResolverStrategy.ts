import { User } from './../../services/domain/User';
import { Request, Response } from 'express';
import { UserService } from '../../services/application/user/UserService';
import { Controller } from '../controller/Controller';
import { SessionService } from './../../services/application/session/SessionService';
export interface ResolverStrategy{
    LogIn(req:Request, res: Response, sessionService: SessionService): Promise<string>;
    Register(id:string, password:string,userService: UserService):Promise<User>;
    Authenticate(token:string):Promise<void>;

}