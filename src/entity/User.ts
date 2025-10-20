import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
    
    @Column({length: 100})
    name!: string;

    @Column({unique: true})
    email!: string;

    @Column({length: 100})
    password!: string;
}