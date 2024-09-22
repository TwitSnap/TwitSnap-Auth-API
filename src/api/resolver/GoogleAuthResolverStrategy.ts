import { InvalidCredentialsError } from './../../services/application/errors/InvalidCredentialsError';
import { FederateRequest } from './../../services/domain/Requests';
import * as jwt from "jsonwebtoken";
import { SessionService } from "../../services/application/session/SessionService";
import { UserService } from "../../services/application/user/UserService";
import { JWT_SECRET } from "../../utils/config";
import { InvalidTokenError } from "./errors/InvalidTokenError";
import { ResolverStrategy } from "./ResolverStrategy";
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

export class GoogleResolverStrategy implements ResolverStrategy{
    public  LogIn = async (req:Request, res:Response, sessionService: SessionService ):Promise<string> => {
        let GOOGLE_OAUTH_URL="https://accounts.google.com/o/oauth2/v2/auth"
        const GOOGLE_OAUTH_SCOPES = [
        "https%3A//www.googleapis.com/auth/userinfo.email",
        "https%3A//www.googleapis.com/auth/userinfo.profile",
        ];
        let CLIENT_ID = process.env.CLIENT_ID as string;
        let REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI as string;
        const state = "some_state";
        const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
        const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
          
        res.redirect("/v1/federate/google");
        return"";
    }


    public Register = async (id:string, password:string, userService:UserService) =>{
        return await userService.register(id, password);
    }

    public Authenticate = async (req:Request, res: Response): Promise<void> => {
        try{
            res.redirect("/v1/federate/google/authenticate")
        }catch(e){
            throw new InvalidCredentialsError("Timedout Or InvalidToken");
        }
    }

    public RedirectAuthScreen = async(req:Request, res:Response, sessionService:SessionService):Promise <void> =>{
        let GOOGLE_OAUTH_URL="https://accounts.google.com/o/oauth2/v2/auth"
        const GOOGLE_OAUTH_SCOPES = [
        "https%3A//www.googleapis.com/auth/userinfo.email",
        "https%3A//www.googleapis.com/auth/userinfo.profile",
        ];
        let CLIENT_ID = process.env.CLIENT_ID as string;
        let REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI as string;
        const state = "some_state";
        const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
        const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
          
        res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
        return 
    }

    public GoogleAuthenticate = async (req:Request, res:Response, sessionService:SessionService):Promise<void>=>{
        try{
            const client = new OAuth2Client();
            const verify = async(token:string) =>{
                await client.verifyIdToken({
                    idToken: token,
                    audience: process.env.CLIENT_ID
                });
            }
            await verify(req.body.token).catch(e=>{throw e})
        }catch(e){
            throw new InvalidCredentialsError("Timedout Or InvalidToken");
        }
    }
}