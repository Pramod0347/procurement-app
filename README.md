# README

1. Project Setup  
    1.a. Prerequisites  
        - Node.js 20+  
        - PostgreSQL with `DATABASE_URL` configured  
        - npm (bundled with Node)  
        - Email inbound: CloudMailin webhook  
        - Env files required: `backend/.env` and `frontend/.env`

    Hosted URLs  
        - Frontend (live): https://procurement-app-delta.vercel.app/  
        - Backend API base: https://procurement-app-backend.onrender.com  

    1.b. Install Steps (Frontend & Backend)  
        1) Backend  
        - `cd backend`  
        - `npm install`  
        2) Frontend  
        - `cd frontend`  
        - `npm install`

    1.c. Email Sending / Receiving Configuration  
        - Inbound: point CloudMailin to `POST https://procurement-app-backend.onrender.com/webhooks/email`.  
        - Backend flow: parse `from`/`to`/`subject`/`plain`/`html`/`message_id`, map sender to vendor, resolve RFP by `RFPID:<id>` or `RFP: <keyword>`, store email, run AI parsing, create proposal for that RFP.  
        - Outbound email: not implemented. Next phase: send RFP invites and proposal receipts via an SMTP/transactional provider (e.g., SendGrid) and add status tracking + retries.

    1.d. How to Run Everything Locally  
        1) Backend  
        - `cd backend`  
        - Create `backend/.env` (see keys below).  
        - `npm run prisma:generate`  
        - Apply schema with Prisma: `npx prisma migrate deploy`  
        - `npm run dev` (http://localhost:4000)  
        2) Frontend  
        - `cd frontend`  
        - Create `frontend/.env` with `VITE_BACKEND_URL=http://localhost:4000`  
        - `npm run dev` (http://localhost:5173)  
        3) Database  
        - Postgres running and reachable via `DATABASE_URL`

    1.e. Seed Data / Initial Scripts  
        - Sample seed included: vendors, RFPs, and proposals (see `backend/prisma/seed.ts`).  
        - To apply it: set `DATABASE_URL` in `backend/.env` to the Render external connection string with `?sslmode=require`, then from `backend/` run `npx prisma migrate deploy` followed by `npx prisma db seed`. If you hit `P1000` auth errors, recheck the password/URL encoding and test with `psql "$DATABASE_URL"`.  
        - You can also add data manually via APIs or `npx prisma studio`.

        Environment Keys (backend/.env)  
        - `DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public"`  
        - `GEMINI_API_KEY=""`  
        - `GROQ_API_KEY=""`  
        - `PORT=4000`

        Environment Keys (frontend/.env)  
        - `VITE_BACKEND_URL="https://procurement-app-backend.onrender.com"` (override to `http://localhost:4000` for local)

2. Tech Stack  
    2.a. Stack Overview  
        - Frontend: React 19, React Router 7, Vite 7, TypeScript, TailwindCSS  
        - Backend: Node.js, Express 5, TypeScript, Prisma, PostgreSQL  
        - AI: Gemini (primary), Groq (fallback)  
        - Email inbound: CloudMailin webhook  
        - Hosting targets: Backend (Render), DB (Render Managed Postgres), Frontend (Vercel/static)

3. API Documentation  
    3.a. Main Endpoints (method + path)  
        - Health: `GET /health`  
        - Vendors: `GET /vendors`, `POST /vendors` `{ name, email, contactPerson?, notes? }`  
        - RFPs: `GET /rfps`, `POST /rfps` `{ title, naturalLanguageInput, budget?, currency?, deliveryDeadline?, paymentTerms?, minimumWarrantyMonths?, structuredSpec? }`, `POST /rfps/from-text` `{ naturalLanguageInput, title? }`  
        - Proposals: `GET /rfps/:rfpId/proposals`, `POST /rfps/:rfpId/proposals` `{ vendorId, totalPrice?, currency?, deliveryDays?, warrantyMonths?, terms?, notes? }`, `POST /rfps/:rfpId/proposals/from-text` `{ vendorId, text, emailMeta? }`, `GET /rfps/:rfpId/compare`, `GET /rfps/:rfpId/emails`  
        - Emails: `GET /emails`  
        - Webhooks: `POST /webhooks/email` (CloudMailin payload with headers/envelope/plain/html)

        Examples  
        - `POST /vendors` → `201` with vendor JSON; `400` on missing fields.
        - `POST /rfps/from-text` → `201` with structured RFP; `400` missing `naturalLanguageInput`.  
        - `POST /rfps/:rfpId/proposals/from-text` → `201` with `{ proposal, parsed }`; `404` if RFP/vendor missing.

4. Decisions & Assumptions  
    4.a. Key Design Decisions  
        - AI parsing for RFPs/proposals (Gemini primary, Groq fallback).  
        - Prisma + Postgres for typed relational data.  
        - Weighted comparison endpoint for price/delivery/warranty.  
        - CloudMailin webhook ingests vendor replies directly into proposals.  
        - JSON-only API, no auth/multi-tenant in this phase.

    4.b. Assumptions  
        - Subjects include an RFP hint (`RFPID:<id>` or keyword) so routing works.  
        - Vendor emails contain enough detail for AI to extract price/delivery/warranty; manual edits are allowed.  
        - Single-tenant usage.  
        - CloudMailin delivers payload fields as expected.

Scoring & Selection (0–10)  
- Weights: price 45%, delivery 35%, warranty 20%.  
- Normalize each criterion 0–1 across proposals; missing values default to 0.5.  
- Total score = `priceScore*0.45 + deliveryScore*0.35 + warrantyScore*0.20`.  
- `scoreOutOf10 = totalScore * 10`; highest wins (`bestProposalId`).

5. AI Tools Usage  
    5.a. Tools Used  
        - ChatGPT/Codex (this assistant)  
        - GitHub Copilot  
        - Gemini  
        - Groq  

    5.b. What They Helped With  
        - ChatGPT/Codex & Copilot: scaffolding, env wiring, endpoint and README writing, frontend tweaks.  
        - Gemini/Groq: runtime parsing of RFP text and vendor emails into structured proposals/specs.  

    5.c. Notable Prompts / Approaches  
        - Convert procurement request into structured JSON (budget, currency, delivery days, items[]).  
        - Extract pricing/delivery/warranty/terms from vendor emails.  
        - Compare proposals with weighted scoring (price/delivery/warranty).  

    5.d. Lessons Learned / Changes from AI Assistance  
        - Structured prompts with strict JSON contracts reduce parsing errors.  
        - Having a fallback model (Groq) improves resilience when the primary model is unavailable.  
        - Human review of AI-parsed proposals is still necessary for edge cases and incomplete emails.
