---
title: Create Translation Files for All Languages
status: todo
priority: high
type: feature
tags: [i18n, translations, content]
created_by: agent
created_at: 2026-05-06T20:19:19Z
position: 11
---

## Notes
Vytvoriť kompletné prekladové JSON súbory pre všetky sekcie stránky v 8 jazykoch. Zahŕňa common, home, about, pricing, fleet, reviews, FAQ, blog, footer.

## Checklist
- [ ] Vytvoriť common.json pre všetky jazyky (navigácia, buttons, forms)
- [ ] Vytvoriť home.json pre hero sekciu a booking form
- [ ] Vytvoriť about.json, pricing.json, fleet.json
- [ ] Vytvoriť reviews.json, faq.json, blog.json
- [ ] Vytvoriť footer.json s kontaktnými informáciami
- [ ] Upraviť všetky komponenty aby používali useTranslation hook

## Acceptance
1. Každý jazyk má kompletné preklady v /public/locales/{locale}/
2. Komponenty zobrazujú správny obsah podľa vybraného jazyka
3. Žiadne hardcoded texty v komponentoch (okrem dátových súborov)