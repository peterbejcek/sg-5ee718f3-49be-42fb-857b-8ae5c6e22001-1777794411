# DNS Nastavenia pre E-TAXI Košice (Vercel Deployment)

## Variant 1: Root doména (e-taxike.sk) - ODPORÚČANÉ

V DNS paneli (WebSupport/iný registrátor) vytvorte tieto záznamy:

### A záznamy (Root doména):
```
Typ: A
Názov: @ (alebo prázdne, alebo e-taxike.sk)
Hodnota: 76.76.21.21
TTL: 3600 (alebo Auto)
```

### CNAME záznam (WWW redirect):
```
Typ: CNAME
Názov: www
Hodnota: cname.vercel-dns.com
TTL: 3600 (alebo Auto)
```

---

## Variant 2: Len WWW subdoména (www.e-taxike.sk)

### CNAME záznam:
```
Typ: CNAME
Názov: www
Hodnota: cname.vercel-dns.com
TTL: 3600
```

### A záznam (redirect root → www):
```
Typ: A
Názov: @ (alebo prázdne)
Hodnota: 76.76.21.21
TTL: 3600
```

---

## Postup v WebSupport paneli:

1. **Prihláste sa do WebSupport Admin**
   - https://admin.websupport.sk

2. **Prejdite na DNS správu:**
   - Služby → Domény → e-taxike.sk → DNS zóna

3. **Odstráňte staré záznamy** (ak existujú):
   - Zmažte staré A záznamy smerujúce na iný server
   - Zmažte staré CNAME záznamy

4. **Pridajte nové záznamy:**

   **Pre root doménu (e-taxike.sk):**
   ```
   Pridať záznam → Typ: A
   - Hostname: @ (alebo nechajte prázdne)
   - IP adresa: 76.76.21.21
   - TTL: 3600
   ```

   **Pre WWW:**
   ```
   Pridať záznam → Typ: CNAME
   - Hostname: www
   - Smeruje na: cname.vercel-dns.com
   - TTL: 3600
   ```

5. **Uložte zmeny**

---

## V Vercel Dashboard:

1. **Otvorte projekt v Vercel:**
   - https://vercel.com/dashboard

2. **Prejdite do Settings → Domains**

3. **Pridajte doménu:**
   - Zadajte: `e-taxike.sk`
   - Kliknite "Add"

4. **Pridajte www verziu (voliteľné):**
   - Zadajte: `www.e-taxike.sk`
   - Označte "Redirect to e-taxike.sk"

5. **Počkajte na validáciu:**
   - Status sa zmení na "Valid" (zelené ✓)
   - SSL certifikát sa vygeneruje automaticky
   - Môže trvať 5-60 minút

---

## Overenie DNS:

**Online nástroje:**
- https://dnschecker.org
  - Zadajte: e-taxike.sk
  - Typ: A
  - Skontrolujte či ukazuje na 76.76.21.21

**Terminál (Windows):**
```
nslookup e-taxike.sk
```

**Terminál (Mac/Linux):**
```
dig e-taxike.sk
```

---

## Časová os:

- **0-5 minút:** DNS zmeny v admin paneli
- **5-60 minút:** DNS propagácia (globálne servery)
- **Po DNS propagácii:** Vercel deteguje doménu a generuje SSL (5-10 min)
- **Celkom:** 15 minút - 2 hodiny (max 48h v zriedkavých prípadoch)

---

## Riešenie problémov:

### ERR_SSL_PROTOCOL_ERROR pretrváva:
1. Overte DNS cez dnschecker.org
2. V Vercel: odstráňte doménu a pridajte znovu
3. Vyčkajte ďalších 30 minút
4. Vyčistite cache prehliadača (Ctrl+Shift+Delete)

### "Invalid Configuration" vo Vercel:
- DNS ešte nie sú propagované
- Overte A záznam: 76.76.21.21
- Počkajte 15-30 minút

### Stránka sa nenačítava:
- Skontrolujte či Vercel projekt je deployed
- Overte Production URL v Vercel dashboard

---

## Príklad správnej konfigurácie:

```
e-taxike.sk
├── A záznam @ → 76.76.21.21 ✅
└── CNAME www → cname.vercel-dns.com ✅

Vercel Domains:
├── e-taxike.sk (Primary) ✅
└── www.e-taxike.sk → redirect to e-taxike.sk ✅

SSL: Let's Encrypt (Auto) ✅
```