import { ResponseDto } from "../dto/ResponseDto";
import { User } from "../entity/User";
import { dataSource } from "./datasource";

export async function auth(userData: any): Promise<ResponseDto> {
  const userRepository = dataSource.getRepository(User);

  if (await userRepository.existsBy({ email: userData.email })) {
    const user = await userRepository.findOneBy({
      email: userData.email,
      password: userData.password,
    });

    if (user) {
      return {
        success: true,
        message: "User with this email already exists!",
        data: user.id
      };
    } else {
        return {
            success: false,
            message: "Invalid credentials"
        }
    }
  }

  const user = new User();
  user.email = userData.email;
  user.password = userData.password;
  user.name = userData.name;

  userRepository.save(user);

  return {
    success: true,
    message: "New user created"
  }
}
