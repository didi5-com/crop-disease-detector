# Workspace

## Overview

Crop Disease Detector — a full-stack web app for detecting plant diseases from leaf images using ML-style analysis. Built for African farmers to diagnose crop diseases, see treatment recommendations, and browse a disease library.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifact: crop-disease-detector, path: /)
- **API framework**: Express 5 (artifact: api-server, path: /api)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Features

- Dashboard with stats summary, recent activity, disease distribution chart
- Scan page: upload leaf image (drag & drop), select crop type, get ML prediction
- Prediction results with disease name, confidence, severity, and treatment
- History: all past scans
- Disease Library: educational reference for crop diseases
- Seeded with 9 diseases (cassava, maize, tomato, rice, potato)

## DB Schema

- `diseases` — disease name, crop type, description, symptoms, treatment, severity
- `predictions` — scan results with crop type, disease, confidence, severity, treatment, isHealthy

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
