# Coding Standards

## General

- Use Angular standalone components (no NgModules).
- Follow the Angular style guide for file and folder naming (`kebab-case`).
- One component/service/model per file.

## Naming Conventions

| Item        | Convention             | Example                    |
| ----------- | ---------------------- | -------------------------- |
| Components  | `kebab-case` selector  | `app-appliance-list`       |
| Services    | `PascalCase` + Service | `ApplianceService`         |
| Models      | `PascalCase` interface | `Appliance`                |
| Files       | `kebab-case`           | `appliance-list.ts`        |
| Constants   | `UPPER_SNAKE_CASE`     | `MAX_RETRY_COUNT`          |

## File Organization

_TODO: Define folder structure conventions as features are added._

## Testing

_TODO: Define unit and integration testing expectations._
