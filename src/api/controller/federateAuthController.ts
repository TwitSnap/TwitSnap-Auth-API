import { InvalidCredentialsError } from './../../services/application/errors/InvalidCredentialsError';
import { sessionService } from './../../utils/container/container';
import { SessionService } from './../../services/application/session/SessionService';
import { injectable } from 'tsyringe';
import { Controller } from './Controller';
import { HttpResponseSender } from './HttpResponseSender';
import {NextFunction, Request, Response} from "express";
import axios from 'axios';
import qs from 'qs';
import { GoogleResolverStrategy } from '../resolver/GoogleAuthResolverStrategy';
import jwt_decode from 'jwt-decode';
import * as jwt from "jsonwebtoken";
import { UserService } from '../../services/application/user/UserService';
import { OAuth2Client } from 'google-auth-library';
import { CLIENT_ID } from '../../utils/config';
@injectable()
export class FederateAuthController extends Controller{
    private userService: UserService;
    private sessionService: SessionService;
    private OAuthClient: OAuth2Client;
    constructor(httpResponseSender: HttpResponseSender, sessionService:SessionService,userService: UserService){
        super(httpResponseSender);
        this.sessionService = sessionService;
        this.userService = userService;
        this.OAuthClient = new OAuth2Client(CLIENT_ID)
    }
    public googleCallback = async (req:Request, res:Response, next: NextFunction) =>{
       
        try{ 
          let googleresolver = new GoogleResolverStrategy();
          googleresolver.RedirectAuthScreen(req,res,this.sessionService);
        }
        catch(error){
            next(error)
        }

    }
    public googleLogIn  = async (req:Request, res:Response, next: NextFunction) =>{
      const code = req.query.code as string;
       
      try{ 
        const { id_token, access_token } = await getGoogleOAuthTokens({ code });
        const ticket = await this.OAuthClient.verifyIdToken({
          idToken:id_token,
          audience: CLIENT_ID
        });
        const payload = ticket.getPayload();
        if (!payload){
          throw new InvalidCredentialsError("");
        }
        if (!payload["email"]){
          throw new InvalidCredentialsError("");
        }
        const token = await this.sessionService.logInFederated(payload["email"]);
        return this.okResponse(res,{token:token});
      }
      catch(error){
          next(error)
      }

    }

    public googleAuthenticate = async(req:Request,res:Response,next:NextFunction) =>{
      try{
        let googleresolver = new GoogleResolverStrategy();
        await googleresolver.GoogleAuthenticate(req,res,this.sessionService);
        this.okResponse(res,{});
      }
      catch(e){
        next(e)
      }
      
    }
      
    
}

interface GoogleTokensResult {
    access_token: string;
    expires_in: Number;
    refresh_token: string;
    scope: string;
    id_token: string;
  }

export async function getGoogleOAuthTokens({
    code,
  }: {
    code: string;
  }): Promise<GoogleTokensResult> {
    const url = "https://oauth2.googleapis.com/token";
  
    const values = {
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    };
    try {
      const res = await axios.post<GoogleTokensResult>(
        url,
        qs.stringify(values),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return res.data;
    } catch (error: any) {
      console.error(error.response.data.error);
      throw new Error(error.message);
    }
  }