import { Router } from "express";
import { federateAuthController, userController } from "../../utils/container/container";
import {PassportAuthService} from "../../services/application/session/PassportAuthService";

const router = Router();

router.post("/v1/register", userController.register);
router.post("/v1/login", userController.logIn);
router.get("/v1/auth/:token", PassportAuthService.authenticate, userController.authenticate);




router.get("/v1/oauth/google",federateAuthController.googleCallback);
router.get("/v1/federate/google",federateAuthController.googleLogIn);
router.use("/v1/federate/google/authenticate",federateAuthController.googleAuthenticate);

export default router;