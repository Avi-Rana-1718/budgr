import { Report } from "../dto/Report";
import nodemailer from "nodemailer";
import { User } from "../entity/User";
import dotenv from "dotenv";
dotenv.config();

export async function sendMail(reportData: Report, userInfo: User) {
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
  }
}

function getEmailBody(
  reportData: Report,
  name: string
) {
  const total = Number(reportData.totalDebit) || 0;
  const avg = Number(reportData.averageDailyDebit) || 0;
  // Parse peak spending time and amount
  const peekData = reportData.peekSpendingTime || "—";
  let peakTime = "—";
  let peakAmount = "";
  
  if (peekData !== "—" && peekData.includes("-")) {
    const [time, amount] = peekData.split("-");
    peakTime = time.trim();
    peakAmount = amount ? `₹${Number(amount).toFixed(2)}` : "";
  }

  const displayName = name
    ? name.trim().charAt(0).toUpperCase() + name.trim().slice(1)
    : "there";

  // Sort daily entries
  const sortedEntries = Object.entries(reportData.dailyDebit || {}).sort(
    ([a], [b]) => a.localeCompare(b)
  );
  
  let dailyRows = "";
  for (const [date, amount] of sortedEntries) {
    dailyRows += `
      <tr>
        <td style="padding: 14px 20px; text-align: left; border-bottom: 1px solid #f0f0f0; font-weight: 500;">
          ${date}
        </td>
        <td style="padding: 14px 20px; text-align: right; border-bottom: 1px solid #f0f0f0; color: #34495e; font-weight: 600;">
          ₹${Number(amount).toFixed(2)}
        </td>
      </tr>
    `;
  }

  return `
  <div style="
    background: #f6f8fa;
    padding: 40px 20px;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.4;
  ">
    <div style="
      max-width: 480px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    ">
      
      <!-- Header Section -->
      <div style="padding: 40px 36px 32px 36px;">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px;">
          <div style="flex: 1;">
            <div style="
              color: #828d9b;
              font-size: 14px;
              font-weight: 500;
              margin-bottom: 8px;
              letter-spacing: 0.5px;
              text-transform: uppercase;
            ">
              This month's spend
            </div>
            <div style="
              font-size: 36px;
              font-weight: 700;
              color: #1a1a1a;
              line-height: 1.1;
              margin-bottom: 4px;
            ">
              ₹${total.toFixed(2)}
            </div>
          </div>
          <div style="
            padding: 10px 20px;
            border-radius: 16px;
            background: #19202b;
            color: #ffffff;
            font-weight: 600;
            font-size: 14px;
            white-space: nowrap;
            margin-left: 16px;
          ">
            👤 ${displayName}
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div style="padding: 0 36px 32px 36px;">
        <div style="
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        ">
          <div style="
            flex: 1;
            background: #252b35;
            border-radius: 16px;
            padding: 24px 20px;
            color: #ffe082;
          ">
            <div style="
              font-size: 13px;
              font-weight: 500;
              opacity: 0.9;
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">
              Average daily spend
            </div>
            <div style="
              font-size: 22px;
              font-weight: 700;
              text-align: right;
              line-height: 1.2;
            ">
              ₹${avg.toFixed(2)}
            </div>
          </div>
          
          <div style="
            flex: 1;
            background: #252b35;
            border-radius: 16px;
            padding: 24px 20px;
            color: #45d8c2;
          ">
            <div style="
              font-size: 13px;
              font-weight: 500;
              opacity: 0.9;
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">
              Peak spending time
            </div>
            <div style="
              font-size: 18px;
              font-weight: 600;
              text-align: right;
              line-height: 1.3;
              margin-bottom: 2px;
            ">
              ${peakTime}
            </div>
            ${peakAmount ? `
            <div style="
              font-size: 14px;
              font-weight: 500;
              text-align: right;
              opacity: 0.8;
              line-height: 1.2;
            ">
              ${peakAmount}
            </div>
            ` : ''}
          </div>
        </div>

        <!-- Daily Breakdown Section -->
        <div style="margin-bottom: 32px;">
          <div style="
            font-weight: 600;
            font-size: 18px;
            color: #1a1a1a;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
          ">
            📅 Daily Breakdown
          </div>
          
          <table style="
            width: 100%;
            border-radius: 16px;
            background: #f8fbff;
            border: 1px solid #e8ecf0;
            overflow: hidden;
            font-size: 15px;
            border-collapse: collapse;
          ">
            <thead>
              <tr>
                <th style="
                  padding: 16px 20px;
                  text-align: left;
                  color: #6b7280;
                  font-size: 13px;
                  font-weight: 600;
                  background: #f1f5f9;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                ">
                  Date
                </th>
                <th style="
                  padding: 16px 20px;
                  text-align: right;
                  color: #6b7280;
                  font-size: 13px;
                  font-weight: 600;
                  background: #f1f5f9;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                ">
                  Amount (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              ${dailyRows}
            </tbody>
          </table>
        </div>

        <!-- Footer Messages -->
        <div style="
          padding: 24px;
          background: #f8fafe;
          border-radius: 16px;
          border-left: 4px solid #45d8c2;
          margin-bottom: 16px;
        ">
          <div style="
            font-size: 16px;
            color: #374151;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
          ">
            💡 Keep tracking your expenses to stay on top of your finances!
          </div>
        </div>
        
        <div style="
          font-size: 12px;
          color: #9ca3af;
          text-align: center;
          line-height: 1.5;
        ">
          You are receiving this email because you subscribed to Spending Tracker reports.
        </div>
      </div>
    </div>
  </div>
  `;
}
