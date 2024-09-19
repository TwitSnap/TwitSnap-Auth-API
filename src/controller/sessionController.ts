import { IntegerType } from "typeorm";

import { sessionService,SessionService } from "../service/sessionService";
import {Request, Response} from "express";
import { WrongUserError } from "../errors/wrongUserError";
import { WrongPasswordError } from "../errors/wrongPasswordError";
class sessionController{

    private service: SessionService;
    constructor(){
        this.service = sessionService;
    }

        /**
     * Delegates the request to the service to register a new user.
     * @param req - The Request object containing the user's information in the request body.
     * @param res - The Response object to send.
     */

    public register = (req: Request, res: Response) => {

    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Register new user',
            required: true,
            schema: {
                data: {
                    id: "uuid",
                    password: "1234"
                }
                
            } 
        }
    */

        try{
            let ans = this.service.register(req.body.data);
            this.setUpAndSendResponse(res,ans,200);
        } catch (error){
            this.setUpAndSendResponse(res,{title:"Error al crea ususario"},404);
       }
    }
    
    public login = (req: any, res: any) =>{
            /* #swagger.responses[202] = {
                description: 'Succesful Login...',
                schema: {
                    data: {
                        token: "unToken",
                    }
                }
            } 
            #swagger.parameters['body'] = {
                in: 'body',
                description: 'Add new user.',
                required: true,
                schema: {
                    data: {
                        id: "user",
                        password: "1234"
                    }
                } 
            }
            */
        let token = this.service.login(req.body.data).then( (value:any) =>{
            this.setUpAndSendResponse(res,{data:{token:value}},202);
        }).catch((error) =>{
            if (error instanceof WrongUserError){
                this.setUpAndSendResponse(res,{title:"No User"},404);
            }
            if (error instanceof WrongPasswordError){
                this.setUpAndSendResponse(res,{title:"Wrong password"},400);
            }
        });
        
    }

    private setUpAndSendResponse = (res: Response, object: any, statusCode: number): void => {
        res.status(statusCode);
        console.log(object);
        res.json(object);
    }

    protected createdResponse = <T>(res: Response, object: T): void => {
        this.setUpAndSendResponse(res, object, 200);
    }
}





export default new sessionController();