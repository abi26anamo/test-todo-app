import { create } from "zustand"
import { api } from "../lib/api"
export interface Todo {
  id: number
  title: string
  completed: boolean
}

interface TodoState {
  todos: Todo[]
  loading: boolean
  fetchTodos: () => Promise<void>
  addTodo: (title: string) => Promise<void>
  toggleTodo: (id: number, done: boolean) => Promise<void>
  deleteTodo: (id: number) => Promise<void>
  updateTodo: (id: number, title: string) => Promise<void>
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  loading: false,

  fetchTodos: async () => {
    set({ loading: true })
    try {
      const { data } = await api.get<Todo[]>("/todos")
      set({ todos: data })
    } finally {
      set({ loading: false })
    }
  },

  addTodo: async (title: string) => {
    const { data } = await api.post<Todo>("/todos", { title })
    set((s) => ({ todos: [...s.todos, data] }))
  },

  toggleTodo: async (id, done) => {
    const { data } = await api.put<Todo>(`/todos/${id}`, { completed: done })
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? data : t)),
    }))
  },

  deleteTodo: async (id) => {
    await api.delete(`/todos/${id}`)
    set((s) => ({ todos: s.todos.filter((t) => t.id !== id) }))
  },

 updateTodo: async (id, title) => {
   const { data } = await api.put<Todo>(`/todos/${id}`, { title })
   set((s) => ({
    todos: s.todos.map((t) => (t.id === id ? data : t)),
  }))
 },
}))
