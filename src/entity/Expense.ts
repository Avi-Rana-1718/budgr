import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Expense {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @Column()
    userId!: string;

    @Column("numeric", { precision: 10, scale: 2 })
    amount!: number;

    @Column("text")
    message!: string;

    @Column({type: "date"})
    time!: string;
}