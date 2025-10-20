import { dataSource } from "./datasource";
import { User } from "../entity/User";
import { ResponseDto } from "../dto/ResponseDto";
import { Expense } from "../entity/Expense";
import { ExpenseDto } from "../dto/ExpenseDto";

export async function trackExpense(
  data: ExpenseDto,
  id: any
): Promise<ResponseDto> {
  try {
    const userRepository = dataSource.getRepository(User);
    const expenseReporsitory = dataSource.getRepository(Expense);
    let userInfo = await userRepository.findOneBy({ id });

    if (!userInfo) {
      return {
        success: false,
        message: "Invalid auth token",
        error: null,
      };
    }
    
    let expenseRecord: Expense = new Expense();
    expenseRecord.amount = data.amount;
    expenseRecord.time = data.time;
    expenseRecord.message = data.message
    expenseReporsitory.save(expenseRecord);
    

    return {
      success: true,
      message: "Expense tracked!",
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      message: "Error while generating report",
      error: err,
    };
  }
}
