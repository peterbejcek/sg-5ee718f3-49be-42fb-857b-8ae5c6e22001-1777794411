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
   - **Application URL:** doména `etaxi-kosice.sk`
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
| `NEXT_PUBLIC_SITE_URL` | `https://etaxi-kosice.sk` |

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
- **DNS domény etaxi-kosice.sk:** nasmerujte A záznam na server Polar55
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
