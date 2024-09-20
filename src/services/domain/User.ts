import {Column, Entity} from "typeorm";

@Entity()
export class User {
    @Column({ primary: true })
    private id: string;

    @Column({ nullable: false })
    private password: string;

    constructor(id: string, password: string) {
        this.id = id;
        this.password = password;
    }
}