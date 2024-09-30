
import { databaseConnector } from './../src/utils/container/container';
import { DataSource, Repository } from 'typeorm';
import { AppDataSource, getDatabaseConfig } from './../src/db/connectors/dataSource';
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { User } from '../src/services/domain/User';
import app from "../src/app"



let repository: Repository<User>;
let connection: DataSource;
let deleteRecord = (id:string) =>{
    return repository.delete(id);
}
beforeAll(async  () => {
    await databaseConnector.initializeConnection();
    connection = new DataSource(getDatabaseConfig());
    connection = await connection.initialize();
    repository = connection.getRepository(User);

})

describe('UserController', () => {

    it('should create record', async () => {
        await request(app)
        .post("/v1/auth/register")
        .send({id:"unID",password:"unapassword"})
        .expect(201);

        await deleteRecord("unID");
    });

})

afterAll( (done) => {
    connection.destroy().then(e =>{
        console.log("Desconexion de la BDD");
    });
    databaseConnector.shutdownConnection().then(e=>{
        console.log("Principal Connector shut down")
    });

    done();

})


