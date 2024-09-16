import { AppDataSource } from "../repository/database";
import Auth from "../models/auth.entity"
import { encrypt } from "../utils/helper";
import { WrongUserError } from "../errors/wrongUserError";
import { WrongPasswordError } from "../errors/wrongPasswordError";

export class userService{
    public async createUser(registerData:any){
        let repo = AppDataSource.getRepository(Auth);
        const encryptedPassword = await encrypt.encryptpass(registerData.password);
        const rep = new Auth();
        rep.hashed_pass = encryptedPassword;
        rep.id = registerData.id;
        repo.save(rep);
        console.log("Se guardo correctamente usuario con contrasenia: ",registerData.password);
        console.log("Con la encriptada: ", encryptedPassword);
        (await AppDataSource.getRepository(Auth).find({take:100})).forEach(query =>{
            console.log(query);
        });
        return encryptedPassword;
    }

    public async logInUser(userData: any){
        let id = userData.id;
        let password = userData.password;
        let repo = AppDataSource.getRepository(Auth);
        let user = await repo.findOne({
            where:{id: id},
        })
        if (!user){
            throw new WrongUserError("Hubo un error");
        }
        console.log(user);
        if (encrypt.comparepassword(user.hashed_pass,password)){
            console.log("The passwords are equal");
            let token = encrypt.generateToken(userData.id);
            console.log("And the token is :", token);
            return token;
        }else{
            throw new WrongPasswordError("");
        }
    }
}