import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { todoFormSchema, TodoFormInput } from "./schemas/todo"

import { Button } from "ui/button"
import { Input } from "ui/input"
import { useTodoStore, Todo } from "./store/userTodoStore"

export default function App() {
  const { todos, loading, fetchTodos, addTodo, toggleTodo,
          deleteTodo, updateTodo } = useTodoStore()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormInput>({ resolver: zodResolver(todoFormSchema) })

  useEffect(() => { fetchTodos() }, [fetchTodos])

  const onAdd = async (data: TodoFormInput) => {
    await addTodo(data.title)
    reset()
  }

  const startEdit  = (t: Todo) => { setEditingId(t.id); setEditingTitle(t.title) }
  const cancelEdit = ()        => { setEditingId(null); setEditingTitle("")  }
  const saveEdit   = async () => {
    if (editingId && editingTitle.trim()) {
      await updateTodo(editingId, editingTitle.trim())
      cancelEdit()
    }
  }

  return (
    <div className="flex flex-col min-h-screen min-w-screen bg-gray-50">
      {/* ───── Add form ───── */}
      <form
        onSubmit={handleSubmit(onAdd)}
        className="w-full max-w-3xl flex gap-4 mb-8 mx-auto"
      >
        <Input
          {...register("title")}
          placeholder="Add a new task"
          className="flex-1 bg-gray-100 border-gray-300"
        />
        <Button type="submit" className="px-6">Add</Button>
      </form>
      {errors.title && (
        <p className="text-center text-red-500 mb-4">
          {errors.title.message}
        </p>
      )}

      {/* ───── List ───── */}
      <main className="w-full max-w-3xl space-y-4 mx-auto">
        {loading && <p className="text-center text-gray-500">Loading…</p>}

        {todos.map(todo => (
          <div
            key={todo.id}
            className="w-full bg-white rounded-lg shadow flex items-center gap-3 px-4 py-3"
          >
            {editingId === todo.id ? (
              <>
                <Input
                  autoFocus
                  value={editingTitle}
                  onChange={e => setEditingTitle(e.target.value)}
                  className="flex-1 bg-gray-100"
                />
                <button
                  onClick={saveEdit}
                  className="px-3 py-1 rounded text-white bg-green-600 hover:bg-green-700 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 rounded border text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-lg text-gray-800">{todo.title}</span>

                <button
                  onClick={() => toggleTodo(todo.id, !todo.completed)}
                  className={`px-3 py-1 rounded text-sm text-white ${
                    todo.completed
                      ? "bg-gray-500 hover:bg-gray-600"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {todo.completed ? "Undo" : "Done"}
                </button>

                <button
                  onClick={() => startEdit(todo)}
                  className="px-3 py-1 rounded text-sm text-white bg-yellow-500 hover:bg-yellow-600"
                >
                  Edit
                </button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        ))}
      </main>
    </div>
  )
}
