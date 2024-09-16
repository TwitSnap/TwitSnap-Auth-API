import { userService } from "../userService";
import { SessionStrategy } from "./sessionStrategy";
import * as jwt from "jsonwebtoken";

export class TokenSessionStrategy implements SessionStrategy{
    register(registerData: any, userService: userService): any {
        return userService.createUser(registerData);
    }
    logIn(logInData: any, userService: userService): Promise<any> {
        return userService.logInUser(logInData);
    }
    
}