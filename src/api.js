import axios from "axios";

export async function getTodos() {
  const {
    data: { todos },
  } = await axios.get("/api/todos");

  return todos;
}

export async function createTodo(text) {
  const {
    data: { todo },
  } = await axios.post("/api/todos", { text, done: false });

  return todo;
}

export async function updateTodo({ id: todoId, update }) {
  const {
    data: { todo },
  } = await axios.patch(`/api/todos/${todoId}`, update);

  return todo;
}
