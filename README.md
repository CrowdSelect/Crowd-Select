# CrowdInsight: AI-Powered Crowdsourced Feedback Platform

CrowdInsight is a cutting-edge web-based platform that revolutionizes the way companies and creators gather and analyze feedback on their content, designs, or products. By leveraging the power of crowdsourcing and artificial intelligence, CrowdInsight provides actionable insights faster and more efficiently than ever before.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Contributing](#contributing)
11. [License](#license)

## Architecture Overview

CrowdInsight follows a microservices-based architecture, utilizing modern technologies to ensure scalability, performance, and maintainability.

![image](https://github.com/user-attachments/assets/9e68f20a-02e8-4892-8def-de6c7b525e13)

- **Frontend**: React with Next.js
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **AI Integration**: OpenAI GPT-4 API
- **Container Orchestration**: Kubernetes

## Features

- Multi-format content submission
- AI-powered question generation
- Intuitive voting and feedback collection
- Real-time relevance assessment
- Automated insight extraction
- Secure authentication and data handling
- Reward system for voters
- Comprehensive analytics dashboard

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- Docker and Docker Compose
- Kubernetes CLI (kubectl)
- PostgreSQL (v12 or later)
- Redis (v6 or later)
- RabbitMQ (v3.8 or later)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/crowdinsight.git
   cd crowdinsight
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your specific configuration.

## Configuration

1. Database setup:
   ```
   psql -U postgres
   CREATE DATABASE crowdinsight;
   ```

2. Run migrations:
   ```
   npm run migrate
   ```

3. Configure AI integration:
   - Obtain API keys from OpenAI
   - Add the API key to your `.env` file

## Running the Application

1. Start the services using Docker Compose:
   ```
   docker-compose up -d
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Access the application at `http://localhost:3000`

## API Documentation

API documentation is available at `/api-docs` when running the development server. This documentation is generated using Swagger.

## Testing

Run the test suite:
```
npm test
```

For end-to-end testing:
```
npm run test:e2e
```

## Deployment

1. Build the Docker images:
   ```
   docker build -t crowdinsight-app .
   ```

2. Push the image to your container registry.

3. Apply Kubernetes configurations:
   ```
   kubectl apply -f k8s/
   ```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

