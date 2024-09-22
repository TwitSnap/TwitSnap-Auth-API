import { Router } from "express";
import { userController } from "../../utils/container/container";

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

export default router;