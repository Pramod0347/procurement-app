# README

1. Project Setup  
1.a. Prerequisites  
- Node.js 20+  
- PostgreSQL (local or hosted); `DATABASE_URL` required  
- npm (bundled with Node)  
- Email inbound: CloudMailin (or any provider forwarding to an HTTP webhook)  
- Environment files: `backend/.env` and `frontend/.env` are required

Hosted URLs  
- Frontend (live): https://procurement-app-delta.vercel.app/  
- Backend API base: https://procurement-app-backend.onrender.com  

1.b. Install Steps (Frontend & Backend)  
- Backend:  
  - `cd backend`  
  - `npm install`  
- Frontend:  
  - `cd frontend`  
  - `npm install`

1.c. Email Sending / Receiving Configuration  
- Inbound: point CloudMailin (or equivalent) to `POST https://<your-backend>/webhooks/email`.  
- Backend will:  
  - Parse `from`, `to`, `subject`, `plain`/`html`, `message_id` from the webhook body.  
  - Map the sender email to an existing vendor.  
  - Resolve RFP by `RFPID:<id>` or `RFP: <keyword>` in the subject.  
  - Store the email, run AI parsing, and create a proposal linked to the RFP.  
- Outbound email is not required/implemented.

1.d. How to Run Everything Locally  
1) Backend  
   - `cd backend`  
   - Create `backend/.env` (see keys below).  
   - `npm run prisma:generate`  
   - Apply schema to DB: `npx prisma migrate deploy` (or `prisma migrate dev` if managing migrations locally).  
   - `npm run dev` (listens on `http://localhost:4000`).  
2) Frontend  
   - `cd frontend`  
   - Create `frontend/.env` with `VITE_BACKEND_URL=http://localhost:4000` (or your deployed backend).  
   - `npm run dev` (Vite on `http://localhost:5173`).  
3) Database  
   - Ensure Postgres is running and reachable via `DATABASE_URL`.

1.e. Seed Data / Initial Scripts  
- No seed data bundled.  
- Optional: create vendors/RFPs via API or use `npx prisma studio` for manual entries.

Environment Keys (backend/.env)  
- `DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public"`  
- `GEMINI_API_KEY=""` (required for AI parsing)  
- `GROQ_API_KEY=""` (fallback AI provider)  
- `PORT=4000`

Environment Keys (frontend/.env)  
- `VITE_BACKEND_URL="https://procurement-app-backend.onrender.com"` (production backend)  
- For local dev, override with `VITE_BACKEND_URL="http://localhost:4000"`

2. Tech Stack  
2.a. Stack Overview  
- Frontend: React 19, React Router 7, Vite 7, TypeScript, TailwindCSS.  
- Backend: Node.js, Express 5, TypeScript, Prisma, PostgreSQL.  
- AI providers: Gemini (primary), Groq (fallback).  
- Email inbound: CloudMailin webhook handler.  
- Infra targets: Backend (Render), DB (Render Managed Postgres), Frontend (any static host).

3. API Documentation  
3.a. Main Endpoints (method + path)  
- Health: `GET /health` → `{ status: "ok" }`.  
- Vendors:  
  - `GET /vendors` → list vendors.  
  - `POST /vendors` body `{ name, email, contactPerson?, notes? }`.  
- RFPs:  
  - `GET /rfps` → list RFPs.  
  - `POST /rfps` body `{ title, naturalLanguageInput, budget?, currency?, deliveryDeadline?, paymentTerms?, minimumWarrantyMonths?, structuredSpec? }`.  
  - `POST /rfps/from-text` body `{ naturalLanguageInput, title? }` → AI-generated structured spec + saved RFP.  
- Proposals:  
  - `GET /rfps/:rfpId/proposals` → proposals for RFP.  
  - `POST /rfps/:rfpId/proposals` body `{ vendorId, totalPrice?, currency?, deliveryDays?, warrantyMonths?, terms?, notes? }`.  
  - `POST /rfps/:rfpId/proposals/from-text` body `{ vendorId, text, emailMeta? }` → parse email text into proposal.  
  - `GET /rfps/:rfpId/compare` → scored comparison result.  
  - `GET /rfps/:rfpId/emails` → proposals created from emails for that RFP.  
- Emails:  
  - `GET /emails` → list stored inbound emails.  
- Webhooks:  
  - `POST /webhooks/email` (CloudMailin format) body includes `headers`, `envelope`, `plain/html`, etc. Returns parsed proposal + email record or validation errors.

Example Success (POST /vendors)  
Request:  
```json
{ "name": "Lenovo India", "email": "sales@lenovo.com" }
```  
Response: `201 Created` with vendor JSON.  
Common Errors: `400` for missing required fields, `500` for server/DB issues.

Example Success (POST /rfps/from-text)  
Request:  
```json
{ "naturalLanguageInput": "Need 20 laptops, delivery in 30 days, $20k budget" }
```  
Response: `201 Created` RFP with structured spec.  
Errors: `400` missing `naturalLanguageInput`, `500` AI/DB failure.

Example Success (POST /rfps/:rfpId/proposals/from-text)  
Request:  
```json
{ "vendorId": "<vendor-id>", "text": "We offer 20 laptops at $950 each, 30 days delivery, 24 month warranty." }
```  
Response: `201 Created` with `{ proposal, parsed }`.  
Errors: `400` missing vendor/text, `404` missing RFP/vendor, `500` AI/DB failure.

4. Decisions & Assumptions  
4.a. Key Design Decisions  
- AI-first parsing: free-text RFPs and vendor emails are converted to structured data via Gemini, with Groq as fallback.  
- Prisma ORM with PostgreSQL for typed models and relational safety.  
- Proposal comparison endpoint provides weighted scoring (price/delivery/warranty) to guide selection.  
- Email webhook ingests vendor replies directly into the proposal pipeline; UI consumes stored emails and proposals separately.  
- CORS + JSON-only API; no auth/multi-tenant logic included.

4.b. Assumptions  
- Vendor email subjects contain an RFP hint (`RFPID:<id>` or keyword) so webhook can route correctly.  
- Vendor emails include enough detail for AI to extract price/delivery/warranty; users can adjust manually if parsing is imperfect.  
- Single-tenant, single-user environment; auth/roles are out of scope.  
- CloudMailin (or equivalent) reliably delivers payload fields as expected.

5. AI Tools Usage  
5.a. Tools Used  
- ChatGPT (documentation and code refactors).  
- Gemini (production AI parsing for RFPs/proposals).  
- Groq (fallback parsing if Gemini fails).

5.b. What They Helped With  
- ChatGPT: documenting setup/endpoints, wiring env handling, minor frontend config.  
- Gemini/Groq: converting natural language RFPs and emails into structured proposals/specs at runtime.

5.c. Notable Prompts / Approaches  
- “Convert this procurement request into structured JSON with fields: budget, currency, deliveryDeadlineDaysFromNow, items[].”  
- “Extract pricing, delivery days, warranty, and terms from this vendor email.”  
- “Compare proposals for an RFP with weighted scoring for price, delivery, warranty.”

5.d. Lessons Learned / Changes from AI Assistance  
- Structured prompts with strict JSON contracts reduce parsing errors.  
- Having a fallback model (Groq) improves resilience when the primary model is unavailable.  
- Human review of AI-parsed proposals is still necessary for edge cases and incomplete emails.
