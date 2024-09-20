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