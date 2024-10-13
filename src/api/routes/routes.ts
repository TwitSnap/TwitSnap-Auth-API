import { Router } from "express";
import { federateAuthController, userController } from "../../utils/container/container";
import {PassportAuthService} from "../../services/application/session/PassportAuthService";

const router = Router();

router.post("/v1/auth/register", userController.register);
router.post("/v1/auth/login", userController.logIn);
router.get("/v1/auth/:token", PassportAuthService.authenticate, userController.authenticate);
router.post("/v1/auth/decrypt",userController.decryptToken);



router.get("/v1/test/login/google",federateAuthController.googleCallback);
router.get("/v1/auth/federate/google/login",federateAuthController.googleLogIn);

export default router;