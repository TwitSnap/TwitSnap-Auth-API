import { InvalidCredentialsError } from '../../services/application/errors/InvalidCredentialsError';
import { SessionService } from '../../services/application/session/SessionService';
import { injectable } from 'tsyringe';
import { Controller } from './Controller';
import { HttpResponseSender } from './HttpResponseSender';
import {NextFunction, Request, Response} from "express";
import axios from 'axios';
import qs from 'qs';
import { OAuth2Client } from 'google-auth-library';
import { CLIENT_ID, CLIENT_SECRET, GOOGLE_REDIRECT_URI } from '../../utils/config';

@injectable()
export class FederateAuthController extends Controller{
    private readonly sessionService: SessionService;
    private OAuthClient: OAuth2Client;

    constructor(httpResponseSender: HttpResponseSender, sessionService:SessionService){
        super(httpResponseSender);
        this.sessionService = sessionService;
        this.OAuthClient = new OAuth2Client(CLIENT_ID)
    }
    public googleCallback = async (req:Request, res:Response, next: NextFunction) =>{
      /*
      Funcion para probar el login
       */
        try{ 
          let GOOGLE_OAUTH_URL="https://accounts.google.com/o/oauth2/v2/auth"
          const GOOGLE_OAUTH_SCOPES = [
          "https%3A//www.googleapis.com/auth/userinfo.email",
          "https%3A//www.googleapis.com/auth/userinfo.profile",
          ];

          const state = "some_state";
          const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
          const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${CLIENT_ID as string}&redirect_uri=${GOOGLE_REDIRECT_URI}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
            
          res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
        }
        catch(error){
            next(error)
        }
    }
    public googleLogIn  = async (req:Request, res:Response, next: NextFunction) =>{
      const code = req.query.code as string;
       
        try{
            const { id_token } = await getGoogleOAuthTokens({ code });

            const ticket = await this.OAuthClient.verifyIdToken({
              idToken: id_token,
              audience: CLIENT_ID
            });

            const payload = ticket.getPayload();

            if (!payload || !payload["email"]){
              throw new InvalidCredentialsError("");
            }

            const token = await this.sessionService.logInFederated(payload["email"]);
            return this.okResponse(res,{token:token});
        } catch(error){
          next(error)
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
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
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