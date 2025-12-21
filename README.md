# DerivSites Clone

A full-stack web application for managing domains and sites, inspired by DerivSites.

## Features
- User authentication (email/password, Google OAuth)
- Dashboard for managing domains/sites
- Add, view, and delete domains (per user)
- Modern UI (Material-UI)

## Getting Started

### Prerequisites
- Node.js
- MongoDB (local or Atlas)

### Setup
1. Clone/download this repository.
2. Configure environment variables in `server/.env` (see sample in file).
3. In `/server`, run:
   - `npm install`
   - `npm start`
4. In `/client`, run:
   - `npm install`
   - `npm start`
5. Visit [http://localhost:3000](http://localhost:3000)

## Customization
- Update Google OAuth credentials in `server/.env`.
- Adjust CORS and environment variables for production.

---

For more details, see `.github/copilot-instructions.md`.
