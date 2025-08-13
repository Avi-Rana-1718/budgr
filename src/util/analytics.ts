import papaparse from "papaparse";
import { dataSource } from "./datasource";
import { User } from "../entity/User";
import { sendMail } from "./mail";
import { ReportDto } from "../dto/ReportDto";
import { Report } from "../entity/Report";
import { ResponseDto } from "../dto/ResponseDto";

export async function generateReport(
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

    let result: any[] = papaparse.parse(data, {
      skipEmptyLines: true,
      skipFirstNLines: 1,
    }).data;

    let report: ReportDto = {
      totalDebit: 0,
      averageDailyDebit: 0,
      dailyDebit: {},
      peekSpendingTime: "",
    };

    let hoursMap = new Map();

    result.forEach((el) => {
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

    await saveReport(report, userInfo);
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

async function saveReport(reportData: ReportDto, userInfo: User) {
  const reportRepository = dataSource.getRepository(Report);
  const report = new Report();
  report.averageDailySpend = reportData.averageDailyDebit;
  report.userId = userInfo.id;
  report.totalSpend = reportData.totalDebit;

  let dailyReport = Object.keys(reportData.dailyDebit);
  report.startDate = dailyReport[0];
  report.endDate = dailyReport[dailyReport.length - 1];

  await reportRepository.save(report);
  console.log("Report saved!");
}
