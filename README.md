# Ops SaaS API

API REST para el Panel de Operaciones de PYMES. Incluye rutas demo para autenticacion, usuarios, clientes, facturacion, tareas y KPIs.

## Stack
- Fastify
- TypeScript
- MySQL

## Scripts
- `npm run dev`
- `npm run migrate`
- `npm run build`
- `npm run start`

## Endpoints
- `GET /health`
- `POST /auth/login`
- `GET /auth/me`
- `GET /users`
- `GET /clients`
- `GET /invoices`
- `GET /tasks`
- `GET /kpis`

## Auth demo
- Usuario: `admin@ops.local`
- Password: `admin123`

## Migraciones
Configura tu .env con credenciales de MySQL y ejecuta:
- `npm run migrate`
