---
title: Design System + Header
status: done
priority: urgent
type: feature
tags: [design-system, header, navigation]
created_by: agent
created_at: 2026-04-27T17:33:07Z
position: 1
---

## Notes
Set up brand colors (deep indigo #282462 primary, warm orange accent), typography (IBM Plex Sans + Inter), and fixed header with prominent call button. Header must remain accessible on mobile scroll.

## Checklist
- [x] Convert #282462 to HSL via terminal
- [x] Configure globals.css: retheme shadcn tokens to indigo/orange/cool-grey palette
- [x] Register IBM Plex Sans + Inter in tailwind.config.ts
- [x] Create Header component: fixed position, logo left, call button right (+421 911 606 206)
- [x] Style call button with warm orange accent (`bg-accent`), phone icon, high contrast

## Acceptance
- Header stays visible when scrolling on mobile
- Call button prominently styled in orange, one-tap callable on phones
- All text uses IBM Plex Sans (headings) or Inter (body)