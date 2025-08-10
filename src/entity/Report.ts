import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @Column()
    userId!: string;

    @Column("numeric", { precision: 10, scale: 2 })
    totalSpend!: number;

    @Column({type: "date"})
    startDate!: string;

    @Column({type: "date"})
    endDate!: string;

    @Column("numeric", { precision: 10, scale: 2 })
    averageDailySpend!: number;
}