import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"
import {
  createTodoSchema,
  updateTodoSchema,
  todoParamsSchema,
} from "./schemas/todo"

dotenv.config()

const prisma = new PrismaClient()
const app    = express()

app.use(cors({ origin: "*" }))
app.use(express.json())

app.get("/", (_req, res) => {
  res.send("✅ TODO API is up and running")
})

app.get("/todos", async (_req, res) => {
  const todos = await prisma.todo.findMany({ orderBy: { id: "asc" } })
  res.json(todos)
})

app.post("/todos", async (req, res) => {
  const body = createTodoSchema.safeParse(req.body)
  if (!body.success) {
    res.status(400).json(body.error.format())
    return
  }
  const todo = await prisma.todo.create({ data: body.data })
  res.status(201).json(todo)
})

app.put("/todos/:id", async (req, res) => {
  const idCheck   = todoParamsSchema.safeParse(req.params)
  const bodyCheck = updateTodoSchema.safeParse(req.body)

  if (!idCheck.success)   { res.status(400).json(idCheck.error.format());   return }
  if (!bodyCheck.success) { res.status(400).json(bodyCheck.error.format()); return }

  try {
    const updated = await prisma.todo.update({
      where: { id: idCheck.data.id },
      data:  bodyCheck.data,
    })
    res.json(updated)
  } catch {
    res.sendStatus(404)
  }
})

app.delete("/todos/:id", async (req, res) => {
  const idCheck = todoParamsSchema.safeParse(req.params)
  if (!idCheck.success) {
    res.status(400).json(idCheck.error.format())
    return
  }

  try {
    await prisma.todo.delete({ where: { id: idCheck.data.id } })
    res.sendStatus(204)
  } catch {
    res.sendStatus(404)
  }
})

const port = Number(process.env.PORT ?? 4000)
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))

process.on("SIGINT", async () => {
  await prisma.$disconnect()
  process.exit()
})
