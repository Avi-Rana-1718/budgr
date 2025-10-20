import {DataSource} from 'typeorm';
import { User } from '../entity/User';
import dotenv from "dotenv"
dotenv.config()

export const dataSource = new DataSource({
    type: "postgres",
    url: process.env.DB_URL,
    synchronize: true,
    logging: false,
    entities: [User]
})