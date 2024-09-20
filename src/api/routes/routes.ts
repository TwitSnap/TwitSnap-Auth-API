import { Router } from "express";
import { userController } from "../../utilss/container/container";

const router = Router();

router.use("/v1/login", userController.logIn);
router.use("/v1/register", userController.register);

export default router;