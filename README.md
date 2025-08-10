# Budgr 💰

A personal budget tracking and analytics application that processes spending data and generates detailed reports via email. Built with Node.js, TypeScript, Express, and PostgreSQL.

## Features

- **CSV Data Processing**: Upload and analyze spending data in CSV format
- **Comprehensive Analytics**: 
  - Total spending calculations
  - Daily spending breakdowns
  - Average daily spending
  - Peak spending time analysis
- **Email Reports**: Automated email delivery of spending reports with beautiful HTML formatting
- **User Management**: User authentication and data isolation
- **Database Storage**: Persistent storage of users and reports using PostgreSQL with TypeORM

## Tech Stack

- **Backend**: Node.js, TypeScript, Express
- **Database**: PostgreSQL with TypeORM
- **Email**: Nodemailer with Mailjet
- **CSV Processing**: PapaParse
- **Environment**: dotenv for configuration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Mailjet account for email delivery

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Avi-Rana-1718/budgr.git
cd budgr
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
DB_URL=postgresql://username:password@localhost:5432/budgr
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_API_SECRET=your_mailjet_api_secret
EMAIL=your_sender_email@domain.com
```

4. Build and start the application:
```bash
npm start
```

The server will start on the port specified in your environment variables (default: 3000).

## API Endpoints

### POST `/auth`
Register a new user or authenticate existing user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "your_password"
}
```

**Response:**
```json
"Saved"
```

### POST `/report?token={user_id}`
Generate and email a spending report from CSV data.

**Query Parameters:**
- `token`: User ID for authentication

**Request Body:**
Raw CSV data with the following format:
```
Time,Date,Amount,Description
9:30am,2023-01-15,25.50,Coffee
2:15pm,2023-01-15,45.00,Lunch
```

**Response:**
```json
{
  "success": true,
  "message": "Report mailed!",
  "error": null
}
```

## CSV Data Format

The application expects CSV data with the following columns:
1. **Time**: Transaction time (e.g., "9:30am", "2:15pm")
2. **Date**: Transaction date (YYYY-MM-DD format)
3. **Amount**: Transaction amount (numeric)
4. **Description**: Transaction description (optional)

## Database Schema

### Users Table
- `id`: UUID (Primary Key)
- `name`: String (100 chars max)
- `email`: String (unique)
- `password`: String (100 chars max)

### Reports Table
- `id`: Auto-increment integer (Primary Key)
- `userId`: UUID (Foreign Key to Users)
- `totalSpend`: Numeric (10,2 precision)
- `startDate`: Date
- `endDate`: Date
- `averageDailySpend`: Numeric (10,2 precision)

## Email Reports

The application generates beautiful HTML email reports containing:
- Total spending for the period
- Average daily spending
- Peak spending time and amount
- Professional formatting with the Budgr branding

## Development

### Project Structure
```
src/
├── index.ts              # Main application entry point
├── dto/
│   └── ReportDto.ts      # Data transfer objects
├── entity/
│   ├── User.ts           # User entity model
│   └── Report.ts         # Report entity model
└── util/
    ├── analytics.ts      # Report generation logic
    ├── datasource.ts     # Database configuration
    └── mail.ts           # Email functionality
```

### Build
```bash
npx tsc
```

### Run
```bash
node dist/index.js
```

## Configuration

The application uses environment variables for configuration:

- `PORT`: Server port (default: from env)
- `DB_URL`: PostgreSQL connection string
- `MAILJET_API_KEY`: Mailjet API key for email delivery
- `MAILJET_API_SECRET`: Mailjet API secret
- `EMAIL`: Sender email address

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email your questions or open an issue on GitHub.
