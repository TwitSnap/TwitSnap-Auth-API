import { FederateAuthController } from './../controller/federateAuthController';
import { Router } from "express";
import { federateAuthController, userController } from "../../utils/container/container";

const router = Router();

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
router.use("/v1/login", userController.logIn);
router.use("/v1/register", userController.register);
router.use("/v1/authenticate",userController.authenticate);
router.get("/v1/oauth/google",federateAuthController.googleCallback);
router.get("/v1/federate/google",federateAuthController.googleLogIn);
router.use("/v1/federate/google/authenticate",federateAuthController.googleAuthenticate);

export default router;