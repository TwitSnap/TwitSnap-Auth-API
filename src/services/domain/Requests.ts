import {NextFunction, Request, Response} from "express";

export class FederateRequest{
    req: Request
    res: Response
}

export class NormalRegisterRequest{
    id: string
    password:string
}

export class NormalLoginRequest{
    email:string;
    password:string
}