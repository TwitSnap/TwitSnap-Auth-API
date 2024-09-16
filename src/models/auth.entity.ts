import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
  } from "typeorm";

@Entity({ name: "auth" })
export default class Auth {
  //@PrimaryGeneratedColumn("uuid")
  @PrimaryColumn({nullable:false})
  id: string;

  @Column({ nullable: false })
  hashed_pass: string;
}

export class TokenResponse{
  token: string
}