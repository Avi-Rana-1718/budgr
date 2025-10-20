import { dataSource } from "./datasource";
import { User } from "../entity/User";
import { ResponseDto } from "../dto/ResponseDto";

export async function trackExpense(
  data: string,
  id: any
): Promise<ResponseDto> {
  try {
    const userRepository = dataSource.getRepository(User);
    let userInfo = await userRepository.findOneBy({ id });

    if (!userInfo) {
      return {
        success: false,
        message: "Invalid auth token",
        error: null,
      };
    }
    
    

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
