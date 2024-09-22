import { ResolverBuilder } from './../resolver/ResolverBuilder';
import {Controller} from "./Controller";
import {HttpResponseSender} from "./HttpResponseSender";
import {NextFunction, Request, Response} from "express";
import {UserService} from "../../services/application/user/UserService";
import {SessionService} from "../../services/application/session/SessionService";
import {injectable} from "tsyringe";

@injectable()
export class UserController extends Controller {
    private userService: UserService;
    private sessionService: SessionService;
    private resolverBuilder: ResolverBuilder;

    constructor(userService: UserService, sessionService: SessionService, httpResponseSender: HttpResponseSender,resolverBuilder:ResolverBuilder) {
        super(httpResponseSender);
        this.userService = userService;
        this.sessionService = sessionService;
        this.resolverBuilder = resolverBuilder;
    }

    public register = async (req: Request, res: Response, next: NextFunction) => {

        try {
            this.getFieldOrBadRequestError(req,"type");
            const strategy = this.resolverBuilder.match(req.body.type);
                this.getFieldOrBadRequestError(req, 'id');
                this.getFieldOrBadRequestError(req, 'password');
                const user = await strategy.Register(req.body.id,req.body.password,this.userService);
                return this.createdResponse(res, {message: 'User created successfully',user:user});
        } catch (error) {
            next(error);
        }
    }

    public logIn =async (req: Request, res: Response, next: NextFunction) => {

        try {
            const strategy = this.resolverBuilder.match(req.body.type);
                this.getFieldOrBadRequestError(req, 'email');
                this.getFieldOrBadRequestError(req, 'password');
    
                const token = await strategy.LogIn(req.body.email, req.body.password,this.sessionService);
                return this.okResponse(res, {token});

        } catch (error) {
            next(error);
        }
    }
}