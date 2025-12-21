# Copilot Instructions for DerivSites Clone

## Project Overview
- Full-stack web app for managing domains and sites, similar to DerivSites.
- Tech stack: React (frontend), Node.js/Express (backend), MongoDB (database).
- Features: User authentication (email/password, Google OAuth), dashboard, domain/site management.

## How to Run
1. Start MongoDB locally or provide a connection string in `server/.env`.
2. In `/server`, run `npm install` then `npm start`.
3. In `/client`, run `npm install` then `npm start`.
4. Access the app at http://localhost:3000

## Main Features
- Register/login with email/password or Google
- Add, view, and delete domains (per user)
- Modern UI with Material-UI

## Notes
- Update Google OAuth credentials in `server/.env`.
- For production, set proper CORS and environment variables.
