import { ReportDto } from "../dto/ReportDto";
import nodemailer from "nodemailer";
import { User } from "../entity/User";
import dotenv from "dotenv";
dotenv.config();

export async function sendMail(reportData: ReportDto, userInfo: User) {
  let date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  try {
    const transporter = nodemailer.createTransport({
      host: "in-v3.mailjet.com",
      port: 2525,
      auth: {
        user: process.env.MAILJET_API_KEY,
        pass: process.env.MAILJET_API_SECRET,
      },
      secure: false,
    });

      await transporter.sendMail({
        from: process.env.EMAIL,
        to: userInfo?.email,
        subject: `Spending Report - ${day + "/" + month + "/" + year} | Budgr`,
        html: getEmailBody(reportData, userInfo.name),
      });

    console.log("Email sent to:", userInfo.email);
  } catch (err) {
    console.log("MAIL ERROR", err);
    return {
      success: false,
      message: "Error while sending mail.",
      error: err,
    };
  }
}

function getEmailBody(reportData: ReportDto, name: string) {
  const total = Number(reportData.totalDebit) || 0;
  const avg = Number(reportData.averageDailyDebit) || 0;

  const peekData = reportData.peekSpendingTime || "—";
  let peakTime = "—";
  let peakAmount = "";
  if (peekData !== "—" && peekData.includes("-")) {
    const [time, amount] = peekData.split("-");
    peakTime = time.trim().toUpperCase();
    peakAmount = amount ? `₹${Number(amount).toFixed(2)}` : "";
  }

  const displayName = name
    ? name.trim().charAt(0).toUpperCase() + name.trim().slice(1)
    : "there";

  // Sort daily entries
  const sortedEntries = Object.entries(reportData.dailyDebit || {}).sort(
    ([a], [b]) => a.localeCompare(b)
  );

  // Build daily spend rows with conditional colors
  let dailyRows = "";
  for (const [date, amount] of sortedEntries) {
    const numAmount = Number(amount);
    let color = "#111827"; // default neutral
    if (numAmount > avg) color = "#d32f2f"; // red for above average
    else if (numAmount < avg) color = "#2e7d32"; // green for below average

    dailyRows += `
      <tr>
        <td style="padding: 12px 16px; text-align: left; border-bottom: 1px solid #f0f0f0;
                   font-weight: 500; color: #34495e;">
          ${date}
        </td>
        <td style="padding: 12px 16px; text-align: right; border-bottom: 1px solid #f0f0f0;
                   font-weight: 600; color: ${color};">
          ₹${numAmount.toFixed(2)}
        </td>
      </tr>
    `;
  }

  return `
  <div style="background: #f9fafb; padding: 32px 12px; font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #111827;">
    <div style="max-width: 520px; margin: auto; background: #fff; border-radius: 16px;
                box-shadow: 0 2px 12px rgba(0,0,0,0.05); overflow: hidden;">

      <!-- Total Spend -->
      <div style="padding: 24px; border-bottom: 1px solid #f0f0f0;">
        <div style="color: #6b7280; font-size: 14px; text-transform: uppercase; font-weight: 500; margin-bottom: 4px;">
          This Month's Spend
        </div>
        <div style="font-size: 36px; font-weight: 700;">
          ₹${total.toFixed(2)}
        </div>
        <div style="color: #828d9b; font-size: 13px; margin-top: 6px;">
          👤 ${displayName}
        </div>
      </div>

      <!-- Average Spend -->
      <div style="padding: 20px; background: #e3f2fd; margin: 16px; border-radius: 12px;">
        <div style="font-size: 13px; font-weight: 500; color: #0d47a1; text-transform: uppercase; margin-bottom: 4px;">
          Average Daily Spend
        </div>
        <div style="font-size: 24px; font-weight: 700; color: #0d47a1;">
          ₹${avg.toFixed(2)}
        </div>
      </div>

      <!-- Peak Spend -->
      <div style="padding: 20px; background: #fce4ec; margin: 0 16px 16px; border-radius: 12px;">
        <div style="font-size: 13px; font-weight: 500; color: #880e4f; text-transform: uppercase; margin-bottom: 4px;">
          Peak Spending Time
        </div>
        <div style="font-size: 20px; font-weight: 600; color: #880e4f;">
          ${peakTime}
        </div>
        ${
          peakAmount
            ? `<div style="font-size: 14px; font-weight: 500; color: #ad1457; margin-top: 2px;">${peakAmount}</div>`
            : ""
        }
      </div>

      <!-- Daily Breakdown Table -->
      <div style="padding: 0 16px 24px;">
        <div style="font-weight: 600; font-size: 18px; margin: 16px 0 8px;">
          📅 Daily Breakdown
        </div>
        <table style="width: 100%; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; border-collapse: collapse; background: white;">
          <thead style="background: #f3f4f6;">
            <tr>
              <th style="padding: 12px 16px; text-align: left; color: #6b7280; font-size: 13px; font-weight: 600;">Date</th>
              <th style="padding: 12px 16px; text-align: right; color: #6b7280; font-size: 13px; font-weight: 600;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${dailyRows}
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div style="padding: 16px; margin: 0 16px 16px; background: #e8f5e9; border-left: 4px solid #43a047; border-radius: 8px; font-size: 15px; color: #2e7d32; font-weight: 500;">
        💡 Keep tracking your expenses to stay on top of your finances!
      </div>

      <div style="font-size: 12px; color: #9ca3af; text-align: center; padding: 0 24px 24px;">
        You are receiving this email because you subscribed to Budgr.
      </div>
    </div>
  </div>
  `;
}