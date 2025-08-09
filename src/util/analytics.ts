import papaparse from "papaparse";
import { dataSource } from "./datasource";
import { User } from "../entity/User";
import { sendMail } from "./mail";
import { Report } from "../dto/Report";

export async function generateReport(data: string, id: any) {
  try {
    const userRepository = dataSource.getRepository(User);
    let userInfo = await userRepository.findOneBy({ id });

    if (!userInfo) {
      throw new Error("User not found");
    }

    let result: any[] = papaparse.parse(data, {
      skipEmptyLines: true,
      skipFirstNLines: 1,
    }).data;

    let report: Report = {
      totalDebit: 0,
      averageDailyDebit: 0,
      dailyDebit: {},
      peekSpendingTime: "",
    };

    let hoursMap = new Map();

    result.forEach((el) => {
      report.totalDebit += Number(el[2]);
      report.dailyDebit[el[1]] =
        (report.dailyDebit[el[1]] || 0) + Number(el[2]);

      let key = get24Time(el[0]);
      if (hoursMap.has(key)) {
        hoursMap.set(key, hoursMap.get(key) + Number(el[2]));
      } else {
        hoursMap.set(key, Number(el[2]));
      }
    });

    report.averageDailyDebit =
      report.totalDebit / Object.keys(report.dailyDebit).length;
    let [hour, peekSpendAgg] = getPeekSpendingHours(hoursMap);
    report.peekSpendingTime = get12Time(hour) + "-" + peekSpendAgg;
    console.log(report);

    sendMail(report, userInfo);
  } catch (err) {
    console.log("ERROR:", err);
  }
}

function get24Time(el: string) {
  let timeStr = el.toLowerCase();
  let isPM = timeStr.includes("pm");

  let hour = Number(timeStr.replace(/am|pm/, "").split(":")[0]);
  hour = Number(hour);

  if (isPM && hour !== 12) {
    hour += 12;
  } else if (!isPM && hour === 12) {
    hour = 0;
  }
  return hour;
}

function get12Time(hour?: number | null) {
  if (!hour) return "Error";

  hour = hour % 24;

  let suffix = hour >= 12 ? "pm" : "am";
  let displayHour = hour % 12;
  if (displayHour === 0) displayHour = 12;

  return `${displayHour}${suffix}`;
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

    if(mostCommonHour==null)
       throw new Error();

  return [mostCommonHour, hoursMap.get(mostCommonHour)]
}
