# Installation Guide

Follow these steps to set up DataMart on your local machine.

## Prerequisites
- Node.js (v18+)
- npm or pnpm
- A Neon Serverless Postgres database
- Stripe Account
- Cloudflare R2 Account (for file storage)

## 1. Clone the repository
Clone the code to your local machine and navigate into the directory:
```bash
git clone <repository-url>
cd datamart
```

## 2. Install dependencies
```bash
npm install
```

## 3. Environment Variables
Copy `.env.example` to `.env` and fill in your actual keys.
```bash
cp .env.example .env
```

## 4. Run the Installer Wizard
To set up your database schema and create your initial admin account, run the built-in wizard:
```bash
npm run dev &
```
Then navigate to `http://localhost:3000/setup` in your browser and follow the prompts.

## 5. Start Development Server
If not already running, start the server:
```bash
npm run dev &
```
You can now view your site at `http://localhost:3000`.
