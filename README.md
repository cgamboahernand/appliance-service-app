# 🏠 Appliance Service App

A full-stack application for managing home appliances — purchase, file compliance reports, schedule maintenance, and interact with an **AI-powered chatbot** that can perform actions on your behalf via tool calling.

Built as a demo project for an **AI Bootcamp**, showcasing how a local LLM (Ollama) integrates with a Spring Boot backend using **Spring AI's tool calling** capabilities.

---

## ✨ Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Dashboard** | Overview with counts and recent activity across all modules |
| 2 | **Purchase Appliances** | Browse a catalog of 20 appliances and purchase them |
| 3 | **File Compliance** | Report compliance issues for owned appliances |
| 4 | **Request Maintenance** | Schedule maintenance for purchased appliances |
| 5 | **AI Chat Widget** | Natural language assistant that can list, purchase, file, and schedule via tool calling |

---

## 🏗️ Tech Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| **Frontend** | Angular 22 | Standalone components, Signals, SCSS, Lazy routes |
| **Testing** | Vitest 4.x | 76 unit tests |
| **Backend** | Spring Boot 3.2.5 | REST API, Spring Data JPA, H2 in-memory DB |
| **AI** | Spring AI 1.0 | Ollama integration with 7 `@Tool` methods |
| **LLM** | Ollama + qwen2.5:7b | Local inference (~4.7 GB), no cloud API keys needed |
| **Rendering** | marked | Markdown rendering for AI chat responses (tables, bold, lists) |

---

## 📁 Project Structure

```
appliance-service-app/
├── frontend/               # Angular 22 SPA
│   ├── src/app/
│   │   ├── features/       # Dashboard, Compliance, Maintenance, Purchase, Chat
│   │   ├── models/         # TypeScript interfaces
│   │   └── services/       # HttpClient-based services
│   └── package.json
├── backend/                # Spring Boot API
│   └── src/main/java/com/applianceservice/
│       ├── ai/             # AiChatService, ApplianceTools (7 @Tool methods)
│       ├── config/         # CORS, DataSeeder (20 appliances, 8 purchases)
│       ├── controller/     # REST controllers + ChatController
│       ├── dto/            # Request/response DTOs
│       ├── model/          # JPA entities
│       ├── repository/     # Spring Data repositories
│       └── service/        # Business logic
├── docs/                   # Documentation
│   ├── architecture.md     # Mermaid diagrams (component + sequence)
│   ├── issues-log.md       # 6 issues found & resolved during testing
│   ├── features/           # Feature specs
│   └── specs/              # Technical specifications
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **Java** ≥ 17
- **Maven** ≥ 3.8
- **Ollama** — [Install Ollama](https://ollama.com)

### 1. Pull the AI model

```bash
ollama pull qwen2.5:7b
```

### 2. Start the backend

```bash
cd backend
mvn spring-boot:run
```

The API will start on **http://localhost:8080**. An H2 in-memory database is seeded automatically with 20 appliances and sample purchases.

### 3. Start the frontend

```bash
cd frontend
npm install
ng serve
```

The app will be available at **http://localhost:4200**.

### 4. Make sure Ollama is running

```bash
ollama serve
```

Ollama must be running on **http://localhost:11434** for the AI chat to work.

---

## 🧪 Running Tests

### Frontend (76 tests)

```bash
cd frontend
ng test
```

### Backend (15 tests)

```bash
cd backend
mvn test
```

---

## 🤖 AI Chat — Tool Calling

The chat widget lets users interact with the system using natural language. The LLM (`qwen2.5:7b`) can invoke 7 backend tools:

| Tool | Action |
|------|--------|
| `listAppliances` | Show the full appliance catalog |
| `purchaseAppliance` | Buy an appliance by serial number |
| `listMyPurchases` | List the user's purchased appliances |
| `fileCompliance` | File a compliance report for an owned appliance |
| `scheduleMaintenance` | Schedule maintenance for an owned appliance |
| `listComplianceReports` | View filed compliance reports |
| `listMaintenanceRequests` | View scheduled maintenance requests |

**Safeguards:**
- Users can only file/schedule against appliances they own
- Duplicate compliance reports (same serial, pending status) are blocked
- Appliance serial numbers are validated against the database

---

## 📊 Architecture

See [`docs/architecture.md`](docs/architecture.md) for full Mermaid diagrams including:
- Component architecture (frontend → backend → AI → DB)
- Sequence diagram for AI chat with tool calling

---

## 🐛 Issues Log

Six issues were discovered and resolved during live demo testing. See [`docs/issues-log.md`](docs/issues-log.md) for details:

| # | Issue | Severity |
|---|-------|----------|
| 1 | AI Chat too slow (model swap) | High |
| 2 | AI-filed data not visible in UI (caching) | Medium |
| 3 | Serial number missing from list | Low |
| 4 | Duplicate compliance reports allowed | High |
| 5 | AI filed report for non-owned appliance | Critical |
| 6 | Infinite HTTP requests on Dashboard | Critical |

---

## 📝 License

This project was built for educational purposes as part of an AI Bootcamp demo.
