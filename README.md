# E-TAXI Košice

Profesionálna taxislužba v Košiciach s online objednávkovým systémom.

## 🚀 Technológie

- Next.js 15 (Page Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Framer Motion
- shadcn/ui

## 📧 Nastavenie emailov

Pre funkčnosť odosielania objednávok cez formulár je potrebné nastaviť email službu:

1. Zaregistrujte sa na [Resend.com](https://resend.com)
2. Vytvorte API kľúč v dashboard
3. Skopírujte `.env.example` do `.env.local`
4. Pridajte váš API kľúč:

```env
RESEND_API_KEY=re_your_api_key_here
```

5. V Resend console overíte doménu `e-taxike.sk` alebo použite testing email

**Bez nastaveného API kľúča:**
- Objednávky sa budú logovať do konzoly
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

Projekt je optimalizovaný pre Vercel deployment. Pri deployment nezabudnite pridať `RESEND_API_KEY` do environment variables.