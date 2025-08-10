import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { generateReport } from "./util/analytics";
import { dataSource } from "./util/datasource";
import { User } from "./entity/User";

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.post("/report", async (req: Request, res: Response) => {
  const response = await generateReport(req.body, req.query.token);
  res.status(response.success ? 200 : 400).json(response);
});

app.post("/auth", (req: Request, res: Response) => {
  let userData = req.body;
  console.log(userData);

  const user = new User();
  user.email = userData.email;
  user.password = userData.password;
  user.name = userData.name;

  let userRepository = dataSource.getRepository(User);
  userRepository.save(user);

  res.json("Saved");
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
