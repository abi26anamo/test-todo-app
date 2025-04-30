# test-todo-app

```
# Todo-App  –  quick start
```

### 1  Clone the repo
```bash
git clone https://github.com/abi26anamo/test-todo-app.git
cd todo-test-app
```

### 2  Backend (API)
```bash
cd backend
npm install
npx prisma migrate dev          # create the DB (uses po by default)
npm run dev                     # API on http://localhost:4000
```

If you prefer Postgres, edit **backend/.env** first:
```
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname?schema=public"
```

---

### 3  Frontend (UI)
Open a second terminal:

```bash
cd todo-test-app/frontend
npm install
npm run dev                     # UI on http://localhost:5173
```

The Vite dev-server proxies every request to **/todos** over to  
`http://localhost:4000`, so the React app and API talk automatically.

---

**That’s it.**  
Browse to **http://localhost:5173**, add / edit / delete todos.