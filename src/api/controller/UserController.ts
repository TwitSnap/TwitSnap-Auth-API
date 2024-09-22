import {Controller} from "./Controller";
import {HttpResponseSender} from "./HttpResponseSender";
import {NextFunction, Request, Response} from "express";
import {UserService} from "../../services/application/user/UserService";
import {SessionService} from "../../services/application/session/SessionService";
import {injectable} from "tsyringe";
import {PassportAuthService} from "../../services/application/session/PassportAuthService";

@injectable()
export class UserController extends Controller {
    private userService: UserService;
    private sessionService: SessionService;

    constructor(userService: UserService, sessionService: SessionService, httpResponseSender: HttpResponseSender) {
        super(httpResponseSender);
        this.userService = userService;
        this.sessionService = sessionService;
    }

    public register = async (req: Request, res: Response, next: NextFunction) => {
        /*
            #swagger.parameters = registerUserDoc
        */

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
        /*
            #swagger.parameters = loginDoc.parameters
            #swagger.responses = loginDoc.responses
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

    public authenticate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await PassportAuthService.authenticate(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}