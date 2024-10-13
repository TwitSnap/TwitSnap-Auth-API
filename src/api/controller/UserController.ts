import {Controller} from "./Controller";
import {HttpResponseSender} from "./HttpResponseSender";
import {NextFunction, Request, Response} from "express";
import {UserService} from "../../services/application/user/UserService";
import {SessionService} from "../../services/application/session/SessionService";
import {injectable} from "tsyringe";
import { logger } from "../../utils/container/container";

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
            const id = this.getFieldOrBadRequestError(req, 'id') as string;
            const password = this.getFieldOrBadRequestError(req, 'password') as string;

            await this.userService.register(id, password);
            return this.createdResponse(res, {message: 'User created successfully'});
        } catch (error) {
            next(error);
        }
    }

    public logIn = async (req: Request, res: Response, next: NextFunction) => {
        /*
            #swagger.parameters = loginDoc.parameters
            #swagger.responses = loginDoc.responses
        */

        try {
            const email = this.getFieldOrBadRequestError(req, 'email') as string;
            const password = this.getFieldOrBadRequestError(req, 'password') as string;

            const token = await this.sessionService.logIn(email, password);
            return this.okResponse(res, {token: token});
        } catch (error) {
            next(error);
        }
    }

    public authenticate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return this.okResponse(res, {user_id: req.params.id});
        } catch (error) {
            next(error);
        }
    }

    public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = this.getFieldOrBadRequestError(req, 'email') as string;
            await this.userService.forgotPassword(email);
            return this.okNoContentResponse(res);
        } catch (error) {
            next(error);
        }
    }

    //TODO Quitar
    public decryptToken = async (req: Request, res: Response, next: NextFunction) => {
        const user_id = this.sessionService.decryptToken(req.body.token);
        logger.logInfo("Se desencripto el token para el uuid: " + user_id);
        return this.okResponse(res, {user_id: user_id});
    }
}