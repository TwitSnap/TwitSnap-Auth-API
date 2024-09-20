import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryColumn()
    private id: string;

    @Column({ nullable: false })
    private password: string;

    constructor(id: string, password: string) {
        this.id = id;
        this.password = password;
    }
}