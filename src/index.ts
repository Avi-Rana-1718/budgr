import dotenv from "dotenv";
import { dataSource } from "./util/datasource";
import { Expense } from "./entity/Expense";
import { ExpenseDto } from "./dto/ExpenseDto";
import { generateReport } from "./util/analytics";
import { Between } from "typeorm";


dotenv.config();

async function main() {
  const expenseRepository = dataSource.getRepository(Expense);
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const fromDate = sevenDaysAgo.toISOString().split("T")[0];
  const toDate = today.toISOString().split("T")[0];

  const expenses: ExpenseDto[] = await expenseRepository.find({
    where: {
      time: Between(fromDate, toDate),
    },
  });
  const userMap = new Map();

  expenses.forEach((el: ExpenseDto)=>{
    if(userMap.has(el.userId)) {
      userMap.set(el.userId, [...userMap.get(el.userId)]);
    } else {
      userMap.set(el.userId, [userMap.get(el.userId)]);
    }
  });

  userMap.forEach(async (key: string, value: ExpenseDto[])=>{
    await generateReport(value, key);
    console.log("Mail send to", key);
  })

  console.log("Done");
  
}

dataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    main()
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
