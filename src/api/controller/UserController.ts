import {Controller} from "./Controller";
import {HttpResponseSender} from "./HttpResponseSender";
import {NextFunction, Request, Response} from "express";
import {UserService} from "../../services/application/user/UserService";
import {TokenSessionStrategy} from "../../services/application/session/strategy/TokenSessionStrategy";
import {SessionService} from "../../services/application/session/SessionService";

class UserController extends Controller {
    private userService: UserService;
    private sessionService: SessionService;

    constructor() {
        super(new HttpResponseSender());
        this.userService = new UserService();
        this.sessionService = new SessionService(new TokenSessionStrategy());
    }

    public register = (req: Request, res: Response, next: NextFunction) => {
        /*#swagger.parameters['body'] = {
                in: 'body',
                description: 'Register new user',
                required: true,
                schema: {
                    data: {
                        id: "uuid",
                        password: "1234"
                    }

                }
        }*/

        try {
            //TODO
        } catch (error) {
            next(error);
        }
    }

    public logIn = (req: Request, res: Response, next: NextFunction) => {
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
        try {
            //TODO
        } catch (error) {
            next(error);
        }
    }
}