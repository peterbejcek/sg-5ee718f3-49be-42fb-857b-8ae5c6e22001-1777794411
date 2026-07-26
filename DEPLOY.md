# Nasadenie na hosting Polar55 (cPanel + Node.js)

Web beží ako Node.js aplikácia cez cPanel funkciu **Setup Node.js App** (Phusion Passenger).
Štartovací súbor aplikácie je `server.js` v koreňovom adresári projektu.

## 1. Vytvorenie Node.js aplikácie v cPanel

1. Prihláste sa do cPanel na Polar55.
2. Otvorte **Setup Node.js App** → **Create Application**.
3. Nastavte:
   - **Node.js version:** 20 alebo novšia (Next.js 15 vyžaduje minimálne Node 18.18)
   - **Application mode:** Production
   - **Application root:** adresár s kódom webu (napr. `etaxi-web`)
   - **Application URL:** doména `e-taxike.sk`
   - **Application startup file:** `server.js`

## 2. Nahranie kódu

Odporúčaný spôsob je Git (cPanel **Git Version Control** alebo cez SSH):

```bash
cd ~/etaxi-web
git clone <URL-repozitára> .
```

Alternatívne nahrajte súbory cez FTP/File Manager (bez `node_modules` a `.next`).

## 3. Inštalácia a build (cez SSH terminál)

V rozhraní Setup Node.js App skopírujte príkaz na aktiváciu virtuálneho
prostredia (zobrazuje sa hore, napr. `source /home/USER/nodevenv/etaxi-web/20/bin/activate`),
potom:

```bash
cd ~/etaxi-web
npm install
npm run build
```

> **Tip:** Ak build zlyhá na nedostatok pamäte, spravte `npm run build` lokálne
> na svojom počítači (s rovnakou verziou Node) a nahrajte adresár `.next/` na server.

## 4. Environment premenné

V **Setup Node.js App** → sekcia **Environment variables** pridajte:

| Premenná | Hodnota |
|---|---|
| `SMTP_HOST` | `smtp.m1.websupport.sk` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `dispecing@e-taxike.sk` |
| `SMTP_PASS` | heslo k e-mailovej schránke |
| `NEXT_PUBLIC_SITE_URL` | `https://e-taxike.sk` |

> **Pozor:** premenné `NEXT_PUBLIC_*` sa zapekajú do kódu počas `npm run build`.
> Ak ich zmeníte, treba spustiť build znova.

## 5. Spustenie a test

1. V Setup Node.js App kliknite **Restart** (po každej zmene kódu alebo premenných).
2. Otvorte web v prehliadači a skontrolujte všetky stránky.
3. **Otestujte objednávkový formulár** — musí prísť e-mail na `dispecing@e-taxike.sk`
   aj potvrdenie zákazníkovi.

## Dôležité upozornenia pri migrácii

- **E-maily zostávajú na WebSupporte.** Schránka `dispecing@e-taxike.sk` (doména
  e-taxike.sk) beží na WebSupporte a web sa na ňu pripája cez SMTP. Pri zmene DNS
  **nemeňte MX záznamy** domény e-taxike.sk, inak prestanú chodiť e-maily.
- **Odchádzajúce SMTP:** overte si u podpory Polar55, že server neblokuje
  odchádzajúce spojenia na port 465 (potrebné pre odosielanie objednávok cez
  smtp.m1.websupport.sk). Po nasadení formulár reálne otestujte.
- **DNS domény e-taxike.sk:** nasmerujte A záznam na server Polar55
  (prípadne presuňte DNS správu k Polar55). SSL certifikát vydá cPanel
  automaticky (AutoSSL/Let's Encrypt).
- Bez nastavených SMTP premenných web funguje, ale objednávky sa iba logujú do
  konzoly servera — e-maily sa neposielajú.

## Aktualizácia webu (ďalšie nasadenia)

```bash
cd ~/etaxi-web
git pull
npm install
npm run build
```

a v cPanel **Setup Node.js App** kliknite **Restart**.

---

# Portál pre vodičov / dispečerov / majiteľa (backend)

Portál je súčasťou tej istej Next.js aplikácie (cesty `/prihlasenie` a `/portal/*`
+ API `/api/portal/*`). Používa databázu **MySQL/MariaDB** cez **Prisma**.

## A. Databáza (cPanel → MySQL Databases)

1. Vytvorte databázu (napr. `etaxi_portal`) a používateľa, priraďte mu **všetky práva**.
2. Zostavte `DATABASE_URL`:
   `mysql://POUZIVATEL:HESLO@localhost:3306/etaxi_portal`
   (host býva `localhost`; ak nie, použite hodnotu od podpory Polar55).

## B. Environment premenné (Setup Node.js App → Environment variables)

| Premenná | Popis |
|---|---|
| `DATABASE_URL` | pripojenie na MySQL/MariaDB (viď vyššie) |
| `AUTH_JWT_SECRET` | náhodný tajný kľúč (min. 32 znakov, napr. `openssl rand -hex 32`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile — site key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile — secret key |
| `INITIAL_OWNER_EMAIL` / `INITIAL_OWNER_PASSWORD` | prvý majiteľ (pri seed) |
| `INITIAL_OWNER_MENO` / `INITIAL_OWNER_PRIEZVISKO` | meno prvého majiteľa |

> Cloudflare Turnstile kľúče získate zdarma na https://dash.cloudflare.com → Turnstile.
> Bez nich portál funguje, ale overenie „že ste človek“ je vypnuté (vhodné len na test).

## C. Inštalácia, migrácia DB a seed (cez SSH)

> **Dôležité:** cPanel Node.js app beží v režime **Production** (`NODE_ENV=production`),
> takže samotné `npm install` **vynechá devDependencies** (napr. TypeScript), ktoré
> `next build` potrebuje. Preto pri inštalácii použite `--include=dev`.
>
> `prisma` aj `tsx` sú zámerne v `dependencies` (nie devDependencies), aby
> `prisma migrate deploy` a `npm run seed` fungovali aj bez dev balíkov a aby
> `npx` nesťahoval nesprávnu verziu Prisma 7 (spôsobovala pád `SIGSEGV`).

```bash
cd ~/etaxi-web
npm install --include=dev       # nainštaluje aj build nástroje; spustí `prisma generate`
npm run prisma:migrate          # = prisma migrate deploy (vytvorí tabuľky)
npm run seed                    # tarify + konfigurácia + prvý majiteľ
npm run build
```

> Používajte lokálnu Prisma cez `npm run prisma:migrate` (skript v package.json),
> **nie** `npx prisma …` — `npx` by mohol sťahovať novšiu nekompatibilnú verziu.
> Ak build padá na nedostatok pamäte (shared hosting), spravte `npm run build`
> lokálne a nahrajte adresár `.next/` na server.

Po builde reštartujte appku v **Setup Node.js App → Restart**.

## D. Výpočet poplatkov

- Poplatok za aplikáciu podľa týždennej tržby (pásma: 0–50→0 €, 51–100→5 €,
  101–150→10 €, 151–250→15 €, 251+→20 €), provízia 15 %, celkový poplatok = súčet.
- Registračný poplatok 30 € jednorazovo za vodiča (evidencia úhrady).
- Poplatok za smenu (prenájom auta) je nastaviteľný na vozidle, prenáša sa do smien
  a eviduje sa jeho úhrada po vodičoch.
- Pásma, sadzbu provízie aj registračný poplatok možno meniť v tabuľkách `FeeTier`
  a `AppSetting` (seednuté predvolenými hodnotami).

## E. Ďalšie nasadenia

```bash
cd ~/etaxi-web
git pull
npm install --include=dev
npm run prisma:migrate      # ak pribudli nové migrácie
npm run build
```
a **Restart** v cPanel.
