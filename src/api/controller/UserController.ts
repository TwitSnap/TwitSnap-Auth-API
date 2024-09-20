import {Controller} from "./Controller";
import {HttpResponseSender} from "./HttpResponseSender";
import {NextFunction, Request, Response} from "express";
import {UserService} from "../../services/application/user/UserService";
import {SessionService} from "../../services/application/session/SessionService";
import {autoInjectable} from "tsyringe";

@autoInjectable()
export class UserController extends Controller {
    private userService: UserService;
    private sessionService: SessionService;

    constructor(userService: UserService, sessionService: SessionService, httpResponseSender: HttpResponseSender) {
        super(httpResponseSender);
        this.userService = userService;
        this.sessionService = sessionService;
    }

    public register = async (req: Request, res: Response, next: NextFunction) => {
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
            this.getFieldOrBadRequestError(req, 'id');
            this.getFieldOrBadRequestError(req, 'password');

            await this.userService.register(req.body.id, req.body.password);
            return this.createdResponse(res, {message: 'User created successfully'});
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
            this.getFieldOrBadRequestError(req, 'email');
            this.getFieldOrBadRequestError(req, 'password');

            const token = this.sessionService.login(req.body.id, req.body.password);
            return this.okResponse(res, {token});
        } catch (error) {
            next(error);
        }
    }
}