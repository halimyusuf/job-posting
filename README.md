# Job Posting — Full-stack Job Board

A simple full-stack job board built with a Node.js/Express + MongoDB backend and a React + TypeScript frontend (Vite + MUI). It supports employers posting jobs and job seekers applying, with role-based authentication and basic filtering.

Key features

- JWT-based auth (users and employers)
- Employers can post, edit, and manage job listings
- Job seekers can search, filter, and apply to jobs
- Application status tracking
- Modern UI using Material-UI (MUI) and responsive layout

Tech stack

- Backend: Node.js, Express, Mongoose (MongoDB), Zod validation
- Frontend: React, TypeScript, Vite, Material-UI (MUI), React Query, Zustand
- Dev tools: Biome formatter, yarn workspaces

Quick setup

Requirements

- Node.js 18+ and yarn installed
- MongoDB (local or hosted) — set a connection string in environment variables

1. Install dependencies

```bash
# from repo root
yarn install
```

2. Environment variables

Create `.env` files for backend and frontend as needed. Example backend `.env`:

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/job-posting
JWT_SECRET=your_jwt_secret
```

3. Run backend and frontend (development)

```bash
# start backend
yarn workspace backend dev

# start frontend
yarn workspace frontend dev
```

4. Formatting and type checks

```bash
# format files
./node_modules/.bin/biome format --write .

# run frontend TypeScript checks
yarn workspace frontend tsc --noEmit
```

5. Useful commands

- Run tests (if any): `yarn test`
- Lint (if configured): `yarn lint`

Publishing

- Before pushing public, ensure `.env` files are NOT committed (they're included in `.gitignore`).
- Update README with any deployment instructions or environment-specific notes.

Contributing

PRs welcome. Please format code with Biome and include TypeScript checks.

License

Specify a license if you want this repo public (e.g., MIT). Replace this section with the chosen license text or file.
