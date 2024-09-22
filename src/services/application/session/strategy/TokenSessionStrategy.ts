import * as jwt from "jsonwebtoken";
import { InvalidCredentialsError } from './../../errors/InvalidCredentialsError';
import { User } from './../../../domain/User';
import {SessionStrategy} from "./SessionStrategy";
import {UserService} from "../../user/UserService";
import axios from 'axios';
import { JWT_SECRET } from "../../../../utils/config";
export class TokenSessionStrategy implements SessionStrategy {
    /**
     * @inheritDoc
     */
    logIn = async (email: string, password: string, userService: UserService): Promise<string> => {
        let UserAPIinCloud = false;

        if (UserAPIinCloud){
            let userAPI = process.env.PROCESS_API || "";
            
            await axios.post(userAPI,{
                email:email
            }).then(response =>{
                if (response.status == axios.HttpStatusCode.BadRequest){
                    throw new InvalidCredentialsError("Email incorrecto");
                }
                else{
                    let id = response.data.id;
                    return this.tokenise(id);
                }
            });

        } 
        else{
            return this.tokenise(email);
        }
       
        throw new Error("Method not implemented.");
    }

    tokenise = async(id:string): Promise<string> =>{
        return jwt.sign({ userId: id }, JWT_SECRET as string, { expiresIn: "1d" });
    }
}