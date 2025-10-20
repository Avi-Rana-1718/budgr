import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { trackExpense } from "./util/analytics";
import { dataSource } from "./util/datasource";
import { auth } from "./util/auth";

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.post("/track", async (req: Request, res: Response) => {
  const response = await trackExpense(req.body, req.query.token);
  res.status(response.success ? 200 : 400).json(response);
});

app.post("/auth", async (req: Request, res: Response) => {
  const response = await auth(req.body);
  res.status(response.success ? 200 : 400).json(response);
});

dataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(process.env.PORT, () => {
      console.log("Server started at port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
