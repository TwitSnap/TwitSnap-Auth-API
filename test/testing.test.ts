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
        await request(app)
        .post("/v1/auth/register")
        .send({id:"unID",password:"unapassword"})
        .expect(201);

    });

    it("should return a token" , async()=>{
        
        await request(app)
        .post("/v1/auth/register")
        .send({id:"unID",password:"unapassword"})
        .expect(201);

        mAxios.get.mockResolvedValue({data:"unID"});

        const response = await request(app)
        .post("/v1/auth/login")
        .send({email:"unEmail",password:"unapassword"})
        .expect(200);
        const token = JSON.parse(response.text).token;
        const {userId} = jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload;
        expect(userId).toBe("unID");

        
    });

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


