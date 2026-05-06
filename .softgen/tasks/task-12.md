---
title: Implement Language Switcher in Header
status: todo
priority: high
type: feature
tags: [i18n, ui, header]
created_by: agent
created_at: 2026-05-06T20:19:19Z
position: 12
---

## Notes
Pridať dropdown s vlajkami pre výber jazyka do Header komponenty. Použiť emoji vlajky alebo SVG ikony. Prepínanie pomocou Next.js router.push s locale parametrom.

## Checklist
- [ ] Vytvoriť LanguageSwitcher komponent s dropdown menu
- [ ] Pridať vlajky pre všetky 8 jazyky (emoji alebo SVG)
- [ ] Implementovať prepínanie cez Next.js router
- [ ] Integrovať do Header komponenty na pravej strane
- [ ] Pridať hover efekty a responzívny dizajn pre mobil
- [ ] Uložiť preferovaný jazyk do localStorage

## Acceptance
1. V hlavičke je viditeľný jazykový prepínač s vlajkami
2. Kliknutím na vlajku sa zmení jazyk celej stránky
3. Po refreshi stránky zostáva vybraný jazyk