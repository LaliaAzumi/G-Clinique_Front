# AI Agent Guide for G-Clinique_Front

## Purpose
This project is a Vite + React + TypeScript frontend for the G-Clinique ERP app.

## Key entry points
- `src/main.tsx`
- `src/App.tsx`

## Important page flow
- `/app/agenda` → `src/clinique/pages/AgendaMedecins.tsx`
- `/app/consultation/:id` → `src/clinique/pages/ConsultationPage.tsx`
- `src/clinique/pages/*` contains other clinic UI pages.

## Relevant API layers
- `src/lib/api-agenda.ts`
- `src/lib/api-appointments.ts`
- `src/lib/api-actemedical.ts`
- `src/lib/api-medicament.ts`

## Debugging focus for appointment and consultation behavior
- `AgendaMedecins.tsx` navigates to consultation with both `rdv.id` and optional `state.rdvData`.
- `ConsultationPage.tsx` loads RDV from `location.state?.rdvData` and falls back to `appointmentService.getById(id)`.
- If form fields disappear after save, the likely issue is data rehydration or mismatch between frontend state and backend response.
- Email sending and ordonnance creation are backend responsibilities; frontend should only send the expected payload.

## Run commands
- `npm install`
- `npm run dev`
- `npm run lint`
- `npm run test`
