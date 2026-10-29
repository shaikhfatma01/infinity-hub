# ♾️ InfinityHub — AI-Powered Universal Shopping Platform

> **“One Search. Every Store. Best Deal.”**  
> *Your AI-powered universal shopping companion.*

---

## 🎨 Luxury Brand Identity & Color Palette

InfinityHub is built using a calibrated **Baby Pink + Chocolate Brown + Cream/White** aesthetic (50% White/Cream, 30% Baby Pink/Blush, 15% Chocolate Brown, 5% Supporting Accents).

| Role | Color | Hex Code | Purpose |
|---|---|---|---|
| **Primary Brand** | Baby Pink / Blush | `#FFB8D1` / `#FCE7F0` | AI highlights, selected states, glows, badges |
| **Primary Contrast** | Chocolate Brown / Cocoa | `#3E2312` / `#2C180B` | Typography, headings, CTAs, prices, footer |
| **Background / Space** | Warm Cream / Off-White | `#FFFDF9` / `#FAF5EF` | Crisp readability, spacious layout |
| **Savings & Status** | Eco Green & Champagne | `#10B981` / `#D4AF37` | True savings, verified deals, Eco scores |

---

## 🌟 The 7 Signature Innovations

1. **🤖 Infinity AI Shopping Agent**: Natural language query extraction parsing budget, ratings, category, specs ("16GB RAM"), and purpose ("for coding").
2. **🔄 Product Twin™ Detection**: Automatically groups identical products appearing across Amazon, Flipkart, Myntra, Nykaa, and Croma into single comparison cards with 🏆 **Best Deal** calculation.
3. **🛒 Smart Cart Optimizer™**: Multi-store basket analyzer that calculates **Before vs After** savings (e.g. Save ₹1,100) with 1-click optimization.
4. **🕵️ Infinity Deal Analyzer™**: Truth detector evaluating advertised discounts against 30-day historical prices to catch fake markups.
5. **📸 Snap & Shop**: Visual search using computer vision matching photos to similar catalog items with % similarity scores.
6. **🎯 Infinity Score (0–100)**: Holistic composite metric weighting price value, verified user ratings, discount authenticity, delivery speed, seller trust, and return warranty.
7. **🎓 Shopping Missions**: Goal-oriented shopping baskets (e.g. **₹15,000 College Setup**, **₹15,000 Cozy Bedroom Decor**, **Developer Workstation**, **Everyday Makeup Kit**).

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+)

### Development Server
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🏆 Supported Stores
- Amazon India
- Flipkart
- Myntra
- Nykaa
- Purplle
- Ajio
- Tata CLiQ
- Croma
- Reliance Digital
- BigBasket
- Blinkit
- Zepto
- Decathlon
- IKEA

## 🗄️ Backend, Supabase & Docker

The repository includes an Express/TypeScript backend in `server/` and Prisma ORM configured for **Supabase Postgres**. The frontend uses `/api` and Docker's Nginx configuration proxies API requests to the backend service.

### Recommended: Docker deployment

See [`README_DEPLOYMENT.md`](README_DEPLOYMENT.md) for full instructions. In short:

1. Copy `.env.docker.example` to `.env` in the project root.
2. Set `DATABASE_URL` to your Supabase Transaction pooler URL, `DIRECT_URL` to your Supabase Direct connection URL, and a random `JWT_SECRET` of at least 32 characters.
3. Run `docker compose up --build -d`.
4. Open `http://localhost:8080`; check `http://localhost:8080/api/health` for API/database status.

The Docker API applies the Prisma schema to Supabase on startup and seeds the initial demo catalogue if it is empty. On Vercel, the API runs as serverless functions; apply the schema and seed demo data manually as documented in `README_DEPLOYMENT.md`. Keep all `.env` files private and do not commit secrets.

### Local development

For frontend-only development, `npm ci && npm run dev` starts Vite on port 3000. To use persistent data, configure the Supabase connection URLs in `server/.env` as documented in `README_DEPLOYMENT.md`, then start the backend from `server/` with `npm run dev`.

### Postman API testing

Import `server/postman/InfinityHub.postman_collection.json` and `server/postman/InfinityHub.local.postman_environment.json` into Postman, then select the **InfinityHub Local API** environment. Start the API with `cd server && npm run dev`. Run **Health and Catalog → Health check (Supabase connection)**, then **List products** to verify the database and initialize the product ID variable.

To test persistence, run **Authentication → Register viva test user** (it creates a new test account and saves its bearer token), then **Cart (Supabase persistence) → Add product to cart** and **Get cart**. The account and cart records are persisted to Supabase Postgres. For a registered account you already have, set the collection variables `loginEmail` and `loginPassword`, then run **Login** instead. The collection covers all registered API routes; requests that change data are grouped separately for optional testing.
