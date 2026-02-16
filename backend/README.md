Quick setup — Valentines Backend

1. Copy `.env.example` to `.env` and set `MONGO_URI` (or run a local MongoDB).
2. Install dependencies: `npm install`
3. Start in dev mode: `npm run dev` (requires `nodemon`) or `npm start`.

API endpoints (CRUD + stats)

- GET  /api/stats
  - Returns: { total, yes, no }

- GET  /api/answers
  - Query: `?page=1&limit=50&answer=yes|no`
  - Returns: { total, page, limit, results: [ ...responses ] }

- GET  /api/answers/:id
  - Returns single response document or 404

- POST /api/answers
  - Body: { name?: string, answer: 'yes' | 'no' }
  - Returns saved document + updated yes count

- PUT  /api/answers/:id
  - Body: { name?: string, answer?: 'yes' | 'no' }
  - Updates name and/or answer

- DELETE /api/answers/:id
  - Deletes a response by id

Examples

- Create:
  curl -X POST http://localhost:5000/api/answers -H "Content-Type: application/json" -d '{"name":"Ana","answer":"yes"}'

- List (filtered):
  curl "http://localhost:5000/api/answers?answer=yes&page=1&limit=20"

- Update:
  curl -X PUT http://localhost:5000/api/answers/<id> -H "Content-Type: application/json" -d '{"name":"Anna","answer":"yes"}'

- Delete:
  curl -X DELETE http://localhost:5000/api/answers/<id>

