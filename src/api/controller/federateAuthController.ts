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
import { FederateRequest } from '../../services/domain/Requests';
const {OAuth2Client} = require('google-auth-library');
@injectable()
export class FederateAuthController extends Controller{

    private sessionService: SessionService;
    constructor(httpResponseSender: HttpResponseSender, sessionService:SessionService){
        super(httpResponseSender);
        this.sessionService = sessionService;
    }
    public googleCallback = async (req:Request, res:Response, next: NextFunction) =>{
        const code = req.query.code as string;
        try{ 
          const { id_token, access_token } = await getGoogleOAuthTokens({ code });
            
          return this.okResponse(res,{id_token,access_token});
        }
        catch(error){
            next(error)
        }

    }
    public googleLogIn  = async (req:Request, res:Response, next: NextFunction) =>{
      let googleresolver = new GoogleResolverStrategy();
      googleresolver.LogIn(req,res,this.sessionService);
    }

    public googleAuthenticate = async(req:Request,res:Response,next:NextFunction) =>{
      try{
        let googleresolver = new GoogleResolverStrategy();
        await googleresolver.Authenticate(req.body.token);
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