---
title: Booking Form
status: todo
priority: high
type: feature
tags: [form, booking, conversion]
created_by: agent
created_at: 2026-04-27T17:33:07Z
position: 2
---

## Notes
Interactive booking form on hero section. Fields: pickup location, destination, date/time, passenger count, optional phone. Validate with Zod. High contrast for mobile UX.

## Checklist
- [ ] Create BookingForm component with React Hook Form + Zod validation
- [ ] Fields: pickup (text), destination (text), datetime (input), passengers (select 1-8), phone (optional tel)
- [ ] Primary CTA button ("Objednať taxík") in indigo, secondary ("Zavolať") in orange
- [ ] Mobile-optimized inputs (large tap targets, clear labels)
- [ ] Form validation messages in Slovak

## Acceptance
- Form submits with validation (required fields checked)
- CTAs clearly distinguishable (indigo order button, orange call button)
- Inputs easy to tap on mobile (min 44px height)