import {JWT_SECRET} from "../../../utils/config";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import {userService} from "../../../utils/container/container";
import passport from "passport";
import {NextFunction, Request, Response} from "express";

export class PassportAuthService {
    /**
     * @function getPassport
     * @description Configures the Passport service with the strategy.
     */
    public static getPassport() {
        const options: StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: (JWT_SECRET as string),
        };

        const strategy = new JwtStrategy(options, PassportAuthService.jwtVerify);
        passport.use(strategy);

        return passport;
    }

    /**
     * @function jwtVerify
     * @description Verifies the JWT token's payload and retrieves the user associated with it.
     *
     * @param {any} payload - The payload of the JWT token.
     * @param {Function} done - The callback function to return the authenticated user or an error.
     *
     * @returns {Promise<void>}
     */
    public static async jwtVerify(payload: any, done: any): Promise<void> {
        try {
            const user = await userService.getUserById(payload.id);
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    }

    /**
     * @function authenticate
     * @description Authenticates the user using the Passport service.
     *
     * @returns {Function} The Passport authentication middleware.
     */
    public static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
        await passport.authenticate('jwt', {session: false})(req, res, next);
    }
}


