Deploying to Render

Quick steps

1) Set your MongoDB connection string as an environment variable in Render: `MONGO_URI` (use Atlas or other hosted MongoDB).
2) Connect your GitHub repository to Render (or use the Render dashboard).
3) Render will auto-detect `render.yaml` and deploy:
   - Serves static frontend files from `/frontend`
   - Runs Express server that mounts serverless API handlers from `/api`

How to deploy (2 minutes)

1) Go to https://render.com/dashboard
2) Click "New+" → "Web Service"
3) Connect your GitHub repo (`Sai79888/my-valatines`)
4) Set build command: `npm install`
5) Set start command: `npm start`
6) Add environment variable:
   - Key: `MONGO_URI`
   - Value: your MongoDB connection string (Atlas recommended)
7) Deploy — Render will build and run your app automatically

Local testing

- Install dependencies at project root:
  npm install
- Start a local MongoDB (or use Docker):
  docker run -d -p 27017:27017 --name valentines-mongo -v mongodata:/data/db mongo:6
- Run dev server:
  npm start
- Open http://localhost:5000 in your browser

Notes

- API routes: `/api/answers` (GET/POST), `/api/answers/:id` (GET/PUT/DELETE), `/api/stats` (GET).
- Render uses `render.yaml` to auto-detect and configure the deployment.
- Keep `MONGO_URI` in Render environment settings (never commit secrets).
- Your app will be served at: `https://your-app-name.onrender.com` (Render will assign a URL)
