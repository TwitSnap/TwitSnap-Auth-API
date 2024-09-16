import { userService } from "../userService";

export interface SessionStrategy{
    register(registerData:any, userService: userService): Promise<any>;
    logIn(registerData:any, userService: userService): Promise<any>;
}