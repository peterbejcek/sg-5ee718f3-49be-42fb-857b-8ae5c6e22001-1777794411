---
title: i18n Setup & Configuration
status: in_progress
priority: urgent
type: feature
tags: [i18n, multilingual, configuration]
created_by: agent
created_at: 2026-05-06T20:19:19Z
position: 10
---

## Notes
Nastaviť Next.js i18n routing a konfiguráciu pre 8 jazykov (sk, en, de, ru, uk, he, hu, ar). Zahŕňa inštaláciu next-i18next, konfiguráciu routingu a základný provider.

## Checklist
- [ ] Nainštalovať next-i18next a závislosti
- [ ] Konfigurovať next.config.mjs pre i18n routing
- [ ] Vytvoriť next-i18next.config.js s nastavením všetkých 8 jazykov
- [ ] Pridať i18n provider do _app.tsx
- [ ] Vytvoriť základnú štruktúru /public/locales/ priečinkov

## Acceptance
1. Server beží bez chýb s i18n konfiguráciou
2. Všetky jazykové priečinky sú vytvorené v /public/locales/
3. Aplikácia má funkčný i18n context