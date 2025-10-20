import papaparse from "papaparse";
import { dataSource } from "./datasource";
import { User } from "../entity/User";
import { sendMail } from "./mail";
import { ReportDto } from "../dto/ReportDto";
import { ResponseDto } from "../dto/ResponseDto";

export async function generateReport(
  data: any,
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

    let result: any[] = data;

    let report: ReportDto = {
      totalDebit: 0,
      averageDailyDebit: 0,
      dailyDebit: {},
      peekSpendingTime: "",
    };

    let hoursMap = new Map();

    result.forEach((el) => {
      if(el[0]==undefined||el[1]==undefined||el[2]==undefined)
        return;
      const amount = Number(el[2].replace("Rs.", ""));
      report.totalDebit += amount;
      report.dailyDebit[el[1]] = (report.dailyDebit[el[1]] || 0) + amount;

      let key = getDailyKey(el[0]);
      if (hoursMap.has(key)) {
        hoursMap.set(key, hoursMap.get(key) + amount);
      } else {
        hoursMap.set(key, amount);
      }
    });

    report.averageDailyDebit =
      report.totalDebit / Object.keys(report.dailyDebit).length;
    let [hour, peekSpendAgg] = getPeekSpendingHours(hoursMap);
    report.peekSpendingTime = hour + "-" + peekSpendAgg;
    console.log(report);

    await sendMail(report, userInfo);

    return {
      success: true,
      message: "Report mailed!",
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

function getDailyKey(el: string) {
  let timeStr = el.toLowerCase();
  return timeStr.split(":")[0] + timeStr.substring(timeStr.length - 2);
}

function getPeekSpendingHours(hoursMap: Map<number, number>) {
  let mostCommonHour = null;
  let maxCount = -Infinity;

  for (const [hour, count] of hoursMap.entries()) {
    if (count > maxCount) {
      maxCount = count;
      mostCommonHour = hour;
    }
  }

  if (mostCommonHour == null) throw new Error();

  return [mostCommonHour, hoursMap.get(mostCommonHour)];
}