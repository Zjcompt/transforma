# Transforma

<div align="center">
  <img src="https://i.imgur.com/87Di20O.png" alt="Transforma Logo" width="200" height="200">
  
  **AI-Powered Data Mapper for Automated Workflows**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg?logo=nodedotjs)](https://nodejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
  [![PostgreSQL](https://img.shields.io/badge/postgresql-17+-blue.svg?logo=postgresql)](https://www.postgresql.org/)
</div>

## Overview

Transforma is a powerful data transformation platform that leverages AI to automatically generate JavaScript functions for mapping data between different schemas. Transforma intelligently creates optimized transformation logic that handles validation, error cases, and complex data mapping scenarios.

## Key Features

- 🤖 **AI-Powered Code Generation**: Automatically generates transformation functions using OpenAI
- 🔄 **Schema-to-Schema Mapping**: Supports JSON Schema or loosly defined JSON if you're feeling spicy
- ⚡ **High-Performance Execution**: Built-in caching system for compiled transformation functions
- 🛡️ **Robust Validation**: Comprehensive input/output validation with detailed error handling
- 📊 **Execution Analytics**: Track transformation usage and performance metrics
- 🔍 **Search & Pagination**: Easily manage and discover existing data maps
- 🏗️ **Monorepo Architecture**: Scalable architecture with shared packages and clear separation of concerns

## How It Works

1. **Schema Definition**: You provide input and output schemas
2. **AI Generation**: Transforma uses OpenAI to generate a JavaScript transformation function
3. **Validation**: The generated function includes robust validation logic
4. **Execution**: Input data is processed through the generated function with performance caching
5. **Analytics**: Execution metrics are tracked for monitoring and optimization

### Example Transformation

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "user_name": {"type": "string"},
    "user_email": {"type": "string"},
    "registration_date": {"type": "string"}
  },
  "required": ["user_name", "user_email"]
}
```

**Output Schema:**
```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "email": {"type": "string"},
    "registeredAt": {"type": "string"}
  },
  "required": ["name", "email"]
}
```

**Generated Function:**
```javascript
function transform(inputObject) {
  if (!inputObject || typeof inputObject !== 'object') {
    throw new Error("Error: Input must be an object");
  }
  
  if (inputObject.user_name == null) {
    throw new Error("Error: user_name is required");
  }
  
  if (inputObject.user_email == null) {
    throw new Error("Error: user_email is required");
  }
  
  return {
    name: inputObject.user_name,
    email: inputObject.user_email,
    registeredAt: inputObject.registration_date || null
  };
}
```

## Quick Start

### Prerequisites

- Node.js 22+
- PostgreSQL database
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zjcompt/transforma.git
   cd transforma
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in `apps/engine/`:
   ```env
   PORT=3000
   ADDRESS=localhost
   DATABASE_URL=postgresql://username:password@localhost:5432/transforma
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=your_desired_model (defaults to 4.1)
   EXECUTION_CACHE_SIZE=100 (defaults to 100)
   ```

4. **Start development servers**
   ```bash
   # Start all applications
   npm run dev
   ```

## Architecture

Transforma is built as a modern TypeScript monorepo using Turborepo:

```
transforma/
├── apps/
│   ├── engine/          # Fastify API backend
│   └── manager/         # React frontend (coming soon)
└── packages/
    ├── imports/         # Shared TypeScript interfaces
    ├── eslint-config/   # Shared ESLint configurations
    └── typescript-config/ # Shared TypeScript configurations
```

### Technology Stack

**Backend (Engine)**
- **Framework**: Fastify with TypeScript
- **Database**: PostgreSQL
- **AI Integration**: OpenAI API
- **Validation**: AJV (JSON Schema validation)
- **Logging**: Pino with pretty printing

**Frontend (Manager)**
- **Framework**: React 19, shadcn/ui, Tailwind
- **Build Tool**: Vite
- **Development**: Hot Module Replacement (HMR)

**Development Tools**
- **Monorepo**: Turborepo for build orchestration
- **Package Manager**: npm workspaces
- **Linting**: ESLint with shared configurations
- **Formatting**: Prettier

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Endpoints

#### Create a Data Map
```http
POST /map
```

**Request Body:**
```json
{
  "name": "User Profile Transformation",
  "type": "jsonSchema",
  "inputSchema": "{\"type\":\"object\",\"properties\":{\"firstName\":{\"type\":\"string\"},\"lastName\":{\"type\":\"string\"}},\"required\":[\"firstName\",\"lastName\"]}",
  "outputSchema": "{\"type\":\"object\",\"properties\":{\"fullName\":{\"type\":\"string\"}},\"required\":[\"fullName\"]}"
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "User Profile Transformation",
  "type": "jsonSchema",
  "inputSchema": "...",
  "outputSchema": "...",
  "javascript": "function transform(inputObject) { ... }",
  "timesRan": 0,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Execute a Data Map
```http
POST /map/{id}/execute
```

**Request Body:**
```json
{
  "input": {
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Response:**
```json
{
  "output": {
    "fullName": "John Doe"
  }
}
```

#### Get All Maps (Paginated)
```http
GET /map?page=1&limit=10&search=profile
```

#### Get/Delete Map by ID
```http
GET /map/{id}
```
```http
DELETE /map/{id}
```

#### Update Map by ID
```http
PUT /map/{id}
```

**Request Body:**
```json
{
  "name": "User Profile Transformation V2",
  "type": "jsonSchema | json",
  "inputSchema": "...",
  "outputSchema": "..."
}
```

**Response:**
```
{ ... Updated map object }
```

#### Get Map Execution History
```http
GET /map/{id}/runs?page=1&limit=10
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/zjcompt/transforma/issues)
- 📧 **Contact**: Zach Compton
- 📚 **Documentation**: Coming soon

## Roadmap

- [x] Complete React frontend
- [ ] OpenAPI Documentation
- [ ] Support for additional data formats (CSV, XML, YAML)
- [ ] Real-time transformation preview
- [ ] Batch processing capabilities
- [ ] Plugin system for custom transformations
- [ ] API rate limiting and authentication
- [ ] Docker containerization

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/zjcompt">Zach Compton</a>
</div>
