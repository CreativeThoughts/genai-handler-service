# GenAI Handler API

A TypeScript-based RESTful API service for handling GenAI requests, containerized with Docker.

## Features

- RESTful API endpoints
- TypeScript support
- Docker containerization
- Environment variable configuration
- CORS support
- Health check endpoint
- Hot reloading for development

## Prerequisites

- Node.js (v14 or higher)
- Docker (for containerization)
- npm or yarn package manager

## Project Structure

```
genai-handler-api/
├── src/
│   ├── routes/
│   │   └── genai.routes.ts
│   ├── controllers/
│   │   └── genai.controller.ts
│   ├── services/
│   │   └── genai.service.ts
│   ├── types/
│   ├── config/
│   ├── middleware/
│   └── index.ts
├── .env
├── .dockerignore
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

## Installation Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd genai-handler-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   ```
   PORT=3000
   NODE_ENV=development
   ```

## Development

1. Start the development server with hot reloading:
   ```bash
   npm run dev
   ```
   The server will start at `http://localhost:3000`

2. Build the TypeScript code:
   ```bash
   npm run build
   ```

3. Run the compiled code:
   ```bash
   npm start
   ```

## Docker Setup

1. Build the Docker image:
   ```bash
   npm run docker:build
   ```

2. Run the Docker container:
   ```bash
   npm run docker:run
   ```

The containerized service will be available at `http://localhost:3000`

## API Endpoints

### GenAI Endpoints

1. Generate AI Response
   - **Endpoint**: `POST /api/genai/generate`
   - **Request Body**:
     ```json
     {
       "prompt": "Your prompt here"
     }
     ```
   - **Response**:
     ```json
     {
       "response": "Generated response"
     }
     ```

### System Endpoints

1. Health Check
   - **Endpoint**: `GET /health`
   - **Response**:
     ```json
     {
       "status": "OK",
       "timestamp": "2024-03-21T12:00:00.000Z"
     }
     ```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Available Scripts

- `npm run dev` - Run in development mode with hot reloading
- `npm run build` - Build the TypeScript code
- `npm start` - Run the compiled code
- `npm run docker:build` - Build the Docker image
- `npm run docker:run` - Run the Docker container

## Development Workflow

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Make changes to the code in the `src` directory
   - The server will automatically reload on changes

3. Test the API endpoints using tools like Postman or curl:
   ```bash
   # Health check
   curl http://localhost:3000/health

   # Generate AI response
   curl -X POST http://localhost:3000/api/genai/generate \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Hello, how are you?"}'
   ```

## Docker Commands

1. Build the image:
   ```bash
   docker build -t genai-handler-api .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 genai-handler-api
   ```

3. Stop the container:
   ```bash
   docker stop $(docker ps -q --filter ancestor=genai-handler-api)
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
