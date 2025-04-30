import { useState, useEffect, FormEvent } from "react"
import { Button } from "ui/button"
import { Input } from "ui/input"
import { useTodoStore, Todo } from "./store/userTodoStore"

export default function App() {
  const {
    todos,
    loading,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
  } = useTodoStore()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState("")

  useEffect(() => { fetchTodos() }, [fetchTodos])

  const handleAdd = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.elements.namedItem("title") as HTMLInputElement
    const title = input.value.trim()
    if (!title) return
    await addTodo(title)
    input.value = ""
  }

  const startEdit = (t: Todo) => { setEditingId(t.id); setEditingTitle(t.title) }
  const cancelEdit = () => { setEditingId(null); setEditingTitle("") }

  const submitEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingId || !editingTitle.trim()) return
    await updateTodo(editingId, editingTitle.trim())
    cancelEdit()
  }

  return (
    <div className="flex flex-col min-h-screen min-w-screen bg-gray-50">
      <form onSubmit={handleAdd} className="w-full max-w-3xl flex gap-4 mb-8">
        <Input
          name="title"
          placeholder="Add a new task"
          className="flex-1 bg-gray-100 border-gray-300"
        />
        <Button type="submit" className="px-6">Add</Button>
      </form>

      <main className="w-full max-w-3xl space-y-4">
        {loading && <p className="text-center text-gray-500">Loading…</p>}

        {todos.map(todo => (
          <div
            key={todo.id}
            className="w-full bg-white rounded-lg shadow flex items-center gap-3 px-4 py-3"
          >
            {editingId === todo.id ? (
              <form onSubmit={submitEdit} className="w-full flex items-center gap-3">
                <Input
                  value={editingTitle}
                  onChange={e => setEditingTitle(e.target.value)}
                  className="flex-1 text-gray-900"
                />
                <Button
                  size="sm"
                  variant="default"
                  className="!bg-green-600 hover:!bg-green-700 !text-white"
                  type="submit"
                >
                  Save
                </Button>

                <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
              </form>
            ) : (
              <>
                <span className="flex-1 text-lg text-gray-800">{todo.title}</span>

                <Button
                    size="sm"
                    variant="default"
                    onClick={() => toggleTodo(todo.id, !todo.completed)}
                    className={
                      todo.completed
                        ? "!bg-gray-500 hover:!bg-gray-600 !text-white"
                        : "!bg-green-600 hover:!bg-green-700 !text-white"
                    }
                  >
                    {todo.completed ? "Undo" : "Done"}
                </Button>


                <Button
                  size="sm"
                  variant="default"
                  onClick={() => startEdit(todo)}
                  className="!bg-yellow-500 hover:!bg-yellow-600 !text-white"
                >
                  Edit
                </Button>

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
