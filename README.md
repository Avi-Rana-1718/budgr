# Budgr 💰

> A powerful personal budget tracking and analytics application that transforms your spending data into actionable insights.

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.0+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)](https://www.postgresql.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

Budgr is a comprehensive budget tracking solution that processes your spending data from CSV files and delivers beautiful, detailed analytics reports directly to your inbox. Whether you're tracking daily expenses or analyzing spending patterns, Budgr provides the insights you need to take control of your finances.

## ✨ Key Features

### 📊 **Advanced Analytics**
- **Total Spending Calculations** - Get comprehensive spending summaries
- **Daily Spending Breakdowns** - Track your daily spending habits
- **Average Daily Spending** - Understand your spending patterns
- **Peak Spending Analysis** - Identify when you spend the most

### 📧 **Automated Email Reports**
- Beautiful HTML-formatted reports delivered to your inbox
- Professional Budgr branding and styling
- Scheduled report generation from your spending data

### 🔒 **Secure User Management**
- User authentication and registration
- Data isolation - your spending data stays private
- UUID-based user identification

### 💾 **Robust Data Storage**
- PostgreSQL database with TypeORM
- Persistent storage of users and reports
- Reliable data integrity and backup

### 📋 **CSV Data Processing**
- Upload spending data in standard CSV format
- Intelligent parsing with PapaParse
- Support for various date and time formats

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| **Runtime** | Node.js + TypeScript |
| **Framework** | Express.js |
| **Database** | PostgreSQL |
| **ORM** | TypeORM |
| **Email Service** | Nodemailer + Mailjet |
| **CSV Processing** | PapaParse |
| **Configuration** | dotenv |

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** database - [Installation guide](https://www.postgresql.org/download/)
- **Mailjet account** for email delivery - [Sign up here](https://www.mailjet.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Avi-Rana-1718/budgr.git
   cd budgr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your environment**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3000
   
   # Database Configuration
   DB_URL=postgresql://username:password@localhost:5432/budgr
   
   # Email Configuration
   MAILJET_API_KEY=your_mailjet_api_key
   MAILJET_API_SECRET=your_mailjet_api_secret
   EMAIL=your_sender_email@domain.com
   ```

4. **Build and start the application**
   ```bash
   npm start
   ```

🎉 **You're all set!** The server will start on `http://localhost:3000` (or your specified port).

## 📊 CSV Data Format

Your CSV file should include the following columns:

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| **Time** | String | Transaction time | `"9:30am"`, `"2:15pm"`, `"11:59pm"` |
| **Date** | String | Transaction date | `"2023-01-15"` (YYYY-MM-DD) |
| **Amount** | Number | Transaction amount | `25.50`, `100.00` |
| **Description** | String | Transaction description *(optional)* | `"Coffee"`, `"Grocery shopping"` |

### Example CSV File:
```csv
Time,Date,Amount,Description
8:15am,2023-12-01,4.50,Morning coffee
12:30pm,2023-12-01,18.75,Lunch
3:45pm,2023-12-01,67.89,Grocery shopping
7:20pm,2023-12-02,25.00,Gas station
```

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);
```

### Reports Table
```sql
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    userId UUID REFERENCES users(id),
    totalSpend DECIMAL(10,2) NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    averageDailySpend DECIMAL(10,2) NOT NULL
);
```

## 📧 Email Reports

Budgr generates professional HTML email reports that include:

- 📈 **Total spending** for the analyzed period
- 📊 **Average daily spending** calculations
- ⏰ **Peak spending time** and amount analysis
- 🎨 **Beautiful formatting** with Budgr branding
- 📱 **Mobile-responsive** design

## 🛠 Development

### Project Structure
```
budgr/
├── src/
│   ├── index.ts              # 🚀 Application entry point
│   ├── dto/
│   │   └── ReportDto.ts      # 📄 Data transfer objects
│   ├── entity/
│   │   ├── User.ts           # 👤 User data model
│   │   └── Report.ts         # 📊 Report data model
│   └── util/
│       ├── analytics.ts      # 📈 Report generation logic
│       ├── datasource.ts     # 🗄 Database configuration
│       └── mail.ts           # 📧 Email functionality
├── package.json
├── tsconfig.json
└── .env                      # ⚙️ Environment configuration
```

### Development Commands

```bash
# Build the TypeScript code
npm run build
# or
npx tsc

# Run the compiled application
npm start
# or
node dist/index.js

# Development mode (if you add nodemon)
npm run dev
```

### Adding Development Dependencies
```bash
# For development with auto-restart
npm install --save-dev nodemon

# Add to package.json scripts:
"scripts": {
  "dev": "nodemon --exec ts-node src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

## ⚙️ Configuration Options

| Environment Variable | Required | Description | Example |
|---------------------|----------|-------------|---------|
| `PORT` | No | Server port | `3000` |
| `DB_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/budgr` |
| `MAILJET_API_KEY` | Yes | Mailjet API key | `your_api_key_here` |
| `MAILJET_API_SECRET` | Yes | Mailjet API secret | `your_api_secret_here` |
| `EMAIL` | Yes | Sender email address | `noreply@yourdomain.com` |

## 🔧 Troubleshooting

### Common Issues

**Database Connection Error**
- Verify PostgreSQL is running
- Check your `DB_URL` in the `.env` file
- Ensure the database exists

**Email Not Sending**
- Verify Mailjet credentials
- Check your sender email is verified with Mailjet
- Ensure your account has sufficient email credits

**CSV Parsing Issues**
- Verify your CSV follows the expected format
- Check for proper date formatting (YYYY-MM-DD)
- Ensure amount values are numeric