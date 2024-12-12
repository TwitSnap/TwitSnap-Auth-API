import { JWT_SECRET } from './../src/utils/config';

import { databaseConnector } from './../src/utils/container/container';
import { DataSource, Repository } from 'typeorm';
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll,jest } from '@jest/globals';
import { User } from '../src/services/domain/User';
import app from "../src/app"
import axios, { AxiosRequestConfig } from 'axios';
import * as jwt from "jsonwebtoken"
import { json } from 'express';

jest.mock("axios");
const mAxios = axios as jest.MockedFunction<typeof axios>;
let repository: Repository<User>;
let connection: DataSource;
let deleteRecord = (id:string) =>{
    return repository.delete(id);
}
beforeAll(async  () => {
    await databaseConnector.initializeConnection();
    //connection = new DataSource(getDatabaseConfig());
    //connection = await connection.initialize();
    repository = databaseConnector.getDataSource().getRepository(User);

})

describe('UserController', () => {

    afterEach( async () =>{
        await deleteRecord("unID").then(e=> expect(e.affected).toBe(1));
    })

    it('should create record', async () => {
        await register_user("unID","unapassword")
        .expect(201);

    });

    it("should return a token" , async()=>{
        
        await register_user("unID","unapassword")
        .expect(201);

        mAxios.get.mockResolvedValue({data:{is_banned:false,uid:"unID"}});

        const response = await obtain_token("unemail","unapassword")
        .expect(200);
        const token = JSON.parse(response.text).token;
        const {userId} = obtain_id(token);
        expect(userId).toBe("unID");

    });

    it("should return 204 for access granted", async () =>{
        await register_user("unID", "unapassword");

        mAxios.get.mockResolvedValue({data:{is_banned:false,uid:"unID"}});

        const response = await obtain_token("unemail","unapassword");
        const token = JSON.parse(response.text).token;

        await request(app)
        .get("/v1/auth/"+token)
        .expect(200);
    })

})
afterAll( (done) => {
    //connection.destroy().then(e =>{
    //    console.log("Desconexion de la BDD");
    //});
    databaseConnector.shutdownConnection().then(e=>{
        console.log("Principal Connector shut down")
    });

    done();

})

const register_user = (id: string, password: string) =>{
    return request(app)
    .post("/v1/auth/register")
    .send({id:id,password:password})
}

const obtain_token = (email:string, password:"unapassword") =>{
    return request(app)
    .post("/v1/auth/login")
    .send({email:"unEmail",password:"unapassword"});
}

const obtain_id = (token:string) => {
    return jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload
}
