Deploying to Vercel

Quick steps

1) Set your MongoDB connection string as an environment variable in Vercel: `MONGO_URI` (use Atlas or other hosted MongoDB).
2) Push this repository to GitHub (or link your Git provider in Vercel).
3) In Vercel, import the project and deploy — Vercel will:
   - Serve static frontend files from `/frontend`
   - Run serverless API endpoints from `/api` (uses Mongoose; ensure `MONGO_URI` is set)

Local testing

- Install dependencies at project root:
  npm install
- Start a local MongoDB (or use Docker):
  docker run -d -p 27017:27017 --name valentines-mongo -v mongodata:/data/db mongo:6
- Open `frontend/index.html` in your browser for the static UI, or run a simple static server.

Notes

- API routes: `/api/answers` (GET/POST), `/api/answers/:id` (GET/PUT/DELETE), `/api/stats` (GET).
- On Vercel set `MONGO_URI` in Project Settings → Environment Variables.
- Keep `server/` folder for local Express dev if you want, but Vercel uses the `api/` serverless functions.
