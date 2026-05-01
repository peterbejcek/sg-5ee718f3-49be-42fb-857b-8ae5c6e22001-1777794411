# E-TAXI Košice

Profesionálna taxislužba v Košiciach s online objednávkovým systémom.

## 🚀 Technológie

- Next.js 15 (Page Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Framer Motion
- shadcn/ui

## 📧 Nastavenie emailov (SMTP)

Pre funkčnosť odosielania objednávok cez formulár je potrebné nakonfigurovať SMTP server:

### Postup nastavenia:

1. **Skopírujte `.env.example` do `.env.local`:**
   ```bash
   cp .env.example .env.local
   ```

2. **Vyplňte SMTP údaje v `.env.local`:**
   ```env
   SMTP_HOST=smtp.m1.websupport.sk
   SMTP_PORT=465
   SMTP_USER=dispecing@e-taxike.sk
   SMTP_PASS=your_actual_password_here
   ```

3. **Reštartujte development server:**
   ```bash
   npm run dev
   ```

### ⚠️ Bezpečnosť:

- **NIKDY** necommitujte `.env.local` do git repository
- `.env.local` je automaticky ignorovaný v `.gitignore`
- Pre production (Vercel) pridajte environment variables v dashboard

### 🔧 SMTP Nastavenia:

- **Server:** smtp.m1.websupport.sk
- **Port:** 465 (SSL/TLS)
- **Autentifikácia:** Vyžadovaná
- **Email odosielateľ:** dispecing@e-taxike.sk
- **Email prijímateľ:** dispecing@e-taxike.sk

### Bez nastaveného SMTP:
- Objednávky sa budú logovať do server konzoly
- Používatelia dostanú notifikáciu o potrebe zavolať priamo

## 🛠️ Inštalácia a spustenie

```bash
npm install
npm run dev
```

Otvorte [http://localhost:3000](http://localhost:3000) vo vašom prehliadači.

## 📦 Production build

```bash
npm run build
npm run start
```

## 🌐 Deployment

Projekt je optimalizovaný pre Vercel deployment. Pri deployment nezabudnite pridať environment variables.