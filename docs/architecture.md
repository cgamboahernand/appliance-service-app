# Architecture Diagram

```mermaid
graph TB
    %% ─── User ───
    User([👤 User])

    %% ─── Frontend Layer ───
    subgraph Frontend["🅰️ Angular 22 Frontend (Port 4200)"]
        direction TB

        subgraph Pages["Pages / Features"]
            Dashboard[Dashboard]
            ComplianceForm[Compliance Form]
            ComplianceList[Compliance List]
            MaintenanceForm[Maintenance Form]
            MaintenanceList[Maintenance List]
            PurchaseCatalog[Purchase Catalog]
            PurchaseList[Purchase List]
            ChatWidget[AI Chat Widget]
        end

        subgraph Services["Angular Services"]
            ApplianceSvc[ApplianceService]
            ComplianceSvc[ComplianceService]
            MaintenanceSvc[MaintenanceService]
            PurchaseSvc[PurchaseService]
            ChatSvc[ChatService]
        end

        Router[Angular Router<br/>Lazy Loading]
    end

    %% ─── Backend Layer ───
    subgraph Backend["☕ Spring Boot 3.2.5 Backend (Port 8080)"]
        direction TB

        subgraph Controllers["REST Controllers"]
            ApplianceCtrl[ApplianceController]
            ComplianceCtrl[ComplianceController]
            MaintenanceCtrl[MaintenanceController]
            PurchaseCtrl[PurchaseController]
            ChatCtrl[ChatController]
        end

        subgraph BackendServices["Business Services"]
            ApplianceBS[ApplianceService]
            ComplianceBS[ComplianceService]
            MaintenanceBS[MaintenanceService]
            PurchaseBS[PurchaseService]
        end

        subgraph AI["🤖 AI Layer (Spring AI 1.0)"]
            AiChatSvc[AiChatService<br/>ChatClient + History]
            ApplianceTools[ApplianceTools<br/>7 @Tool Methods]
        end

        subgraph Data["Data Layer"]
            Repos[JPA Repositories]
            Seeder[DataSeeder<br/>20 Appliances + Purchases]
        end
    end

    %% ─── External Services ───
    subgraph External["🧠 Local AI Infrastructure"]
        Ollama[Ollama Server<br/>Port 11434]
        Model[qwen2.5:7b<br/>~4.7GB]
    end

    subgraph DB["💾 Database"]
        H2[(H2 In-Memory DB<br/>appliancedb)]
    end

    %% ─── Connections ───
    User --> Router
    Router --> Pages
    Pages --> Services

    ApplianceSvc -->|HTTP GET /api/appliances| ApplianceCtrl
    ComplianceSvc -->|HTTP GET/POST /api/compliance| ComplianceCtrl
    MaintenanceSvc -->|HTTP GET/POST /api/maintenance| MaintenanceCtrl
    PurchaseSvc -->|HTTP GET/POST /api/purchases| PurchaseCtrl
    ChatSvc -->|HTTP POST /api/chat| ChatCtrl

    ApplianceCtrl --> ApplianceBS
    ComplianceCtrl --> ComplianceBS
    MaintenanceCtrl --> MaintenanceBS
    PurchaseCtrl --> PurchaseBS
    ChatCtrl --> AiChatSvc

    AiChatSvc -->|Prompt + Tools| Ollama
    Ollama --> Model
    AiChatSvc --> ApplianceTools
    ApplianceTools -->|Tool Calling| BackendServices

    BackendServices --> Repos
    Repos --> H2
    Seeder -->|Seed Data| H2

    %% ─── Styling ───
    classDef frontend fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    classDef backend fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    classDef ai fill:#ede9fe,stroke:#8b5cf6,stroke-width:2px
    classDef db fill:#d1fae5,stroke:#10b981,stroke-width:2px
    classDef external fill:#fce7f3,stroke:#ec4899,stroke-width:2px

    class Dashboard,ComplianceForm,ComplianceList,MaintenanceForm,MaintenanceList,PurchaseCatalog,PurchaseList,ChatWidget,ApplianceSvc,ComplianceSvc,MaintenanceSvc,PurchaseSvc,ChatSvc,Router frontend
    class ApplianceCtrl,ComplianceCtrl,MaintenanceCtrl,PurchaseCtrl,ChatCtrl,ApplianceBS,ComplianceBS,MaintenanceBS,PurchaseBS,Repos,Seeder backend
    class AiChatSvc,ApplianceTools ai
    class H2 db
    class Ollama,Model external
```

## Component Overview

| Layer | Technology | Responsibility |
|-------|-----------|----------------|
| **Frontend** | Angular 22 (Standalone, Signals) | UI, routing, state management |
| **REST API** | Spring Boot 3.2.5 | CRUD operations, validation |
| **AI Layer** | Spring AI 1.0 + Ollama | Natural language processing, tool calling |
| **Data** | Spring Data JPA + H2 | Persistence, seeding |
| **LLM** | Ollama + qwen2.5:7b | Local inference, function calling |

## Data Flow: AI Chat with Tool Calling

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant CW as Chat Widget
    participant CS as ChatService
    participant CC as ChatController
    participant AI as AiChatService
    participant LLM as Ollama (qwen2.5:7b)
    participant T as ApplianceTools
    participant DB as H2 Database

    U->>CW: Types message
    CW->>CS: sendMessage(text)
    CS->>CC: POST /api/chat {sessionId, message}
    CC->>AI: chat(sessionId, message)
    AI->>LLM: Prompt + Conversation History + Tools
    LLM-->>AI: Tool Call (e.g., listMyPurchases)
    AI->>T: Execute @Tool method
    T->>DB: Query data
    DB-->>T: Results
    T-->>AI: Formatted response
    AI->>LLM: Tool result + Continue
    LLM-->>AI: Final natural language response
    AI-->>CC: Response text
    CC-->>CS: {message: "..."}
    CS-->>CW: Observable<string>
    CW->>CW: renderMarkdown(content)
    CW-->>U: Formatted response (tables, bold, lists)
```

## Key Architectural Decisions

1. **Standalone Components** — No NgModules; each component declares its own imports.
2. **Signals for State** — Angular signals replace RxJS-based state management.
3. **Local LLM** — Ollama runs locally; no cloud API keys needed for the demo.
4. **Tool Calling** — Spring AI `@Tool` annotations let the LLM invoke backend services directly.
5. **In-Memory DB** — H2 resets on restart; `DataSeeder` provides consistent demo data.
6. **Markdown Rendering** — `marked` library renders AI responses with rich formatting.
