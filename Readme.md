# Medical Appointment System

A serverless medical appointment scheduling system built with AWS Lambda, DynamoDB, SNS, SQS, EventBridge, and MySQL using hexagonal architecture.

## Project Structure

```
src/
├── domain/
│   ├── entities/           # Core business entities
│   ├── repositories/       # Repository interfaces
│   ├── services/           # Domain service interfaces
│   └── value-objects/      # Value objects and DTOs
├── application/
│   └── use-cases/          # Business use cases
└── infrastructure/
    ├── handlers/           # Lambda handlers
    ├── repositories/       # Repository implementations
    └── services/           # Service implementations
```

## Installation

1. Configure AWS CLI:

```bash
# Configure your AWS credentials
aws configure
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.template .env
```

4. Set up MySQL databases:

Execute the SQL schema `./database/mysql-schema.sql` using MySQL Workbench

## Deployment

Deploy to development environment:

```bash
npm run deploy:dev
```

Deploy to production environment:

```bash
npm run deploy:prod
```

## Removal

Remove development environment:

```bash
npm run remove:dev
```

Remove production environment:

```bash
npm run remove:prod
```

## API Endpoints

**Base URL:** `https://your-api-gateway-url/dev`

### Create Appointment

```http
POST {BASE_URL}/appointments

{
  "insuredId": "string",
  "scheduleId": number,
  "countryISO": "PE" | "CL"
}
```

**Response:**

```json
{
  "id": "uuid",
  "message": "Appointment created successfully"
}
```

### Get Appointments by Insured ID

```http
GET {BASE_URL}/appointments/{insuredId}
```

**Response:**

```json
{
  "appointments": [
    {
      "id": "uuid",
      "insuredId": "string",
      "scheduleId": number,
      "countryISO": "PE" | "CL",
      "status": "pending" | "completed" | "failed",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

## Environment Variables

### Required for Deployment

- `MYSQL_HOST`: MySQL host
- `MYSQL_USER`: MySQL username
- `MYSQL_PASSWORD`: MySQL password
- `MYSQL_PE_DATABASE`: MySQL database name for Peru
- `MYSQL_CL_DATABASE`: MySQL database name for Chile

### Auto-configured by Serverless

- `APPOINTMENTS_TABLE`: DynamoDB table name
- `SNS_TOPIC_ARN`: SNS topic ARN
- `EVENT_BRIDGE_NAME`: EventBridge event bus name
- `SQS_COMPLETION_URL`: Completion queue URL

## AWS Resources Created

- **DynamoDB Table**: Stores appointment records
- **SNS Topic**: Publishes appointment requests
- **SQS Queues**:
  - `{service}-pe-{stage}`: Peru appointments queue
  - `{service}-cl-{stage}`: Chile appointments queue
  - `{service}-completion-{stage}`: Completion notifications queue
- **EventBridge**: Custom event bus for appointment confirmations
- **Lambda Functions**:
  - `appointment`: Main API handler
  - `appointmentPe`: Peru appointment processor
  - `appointmentCl`: Chile appointment processor
  - `appointmentCompletion`: Completion processor
- **API Gateway**: REST API endpoints

## Logs Development

```bash
# API Gateway handler logs
aws logs tail /aws/lambda/medical-appointment-system-dev-appointmentApi --follow

# Peru appointment processor logs
aws logs tail /aws/lambda/medical-appointment-system-dev-appointmentPe --follow

# Chile appointment processor logs
aws logs tail /aws/lambda/medical-appointment-system-dev-appointmentCl --follow

# Completion processor logs
aws logs tail /aws/lambda/medical-appointment-system-dev-appointmentCompletion --follow
```
