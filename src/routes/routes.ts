import { Router } from 'express';
import session from "../controller/sessionController";

const myrouter = Router();

myrouter.post("/login", session.login);
myrouter.post("/register", session.register);


export default myrouter