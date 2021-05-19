import { useState } from "react";
import styled from "styled-components";
import { QueryProvider } from "./query";
import { useTodosList, useTodosService } from "./hooks";

function TodoList() {
  const { todos, ready } = useTodosList();
  const { updateTodo } = useTodosService();

  if (!ready) {
    return <p>Loading...</p>;
  }

  return (
    <List>
      {todos.map((todo) => {
        return (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                disabled={todo.id < 0}
                onChange={() => updateTodo(todo.id, { done: !todo.done })}
              />
              <span>{todo.text}</span>
            </label>
          </li>
        );
      })}
    </List>
  );
}

function TodoAdder() {
  const { createTodo } = useTodosService();
  const [text, setText] = useState("");
  const isValid = text.length > 0;
  const onSubmit = (event) => {
    event.preventDefault();
    if (!isValid) {
      return;
    }
    createTodo(text);
    setText("");
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        autoFocus
        type="text"
        placeholder="Your todo here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" disabled={!isValid}>
        Add
      </button>
    </form>
  );
}

function HomePage() {
  return (
    <Page>
      <h1>Todo!</h1>
      <TodoAdder />
      <TodoList />
    </Page>
  );
}

function App() {
  return (
    <QueryProvider>
      <HomePage />
    </QueryProvider>
  );
}

export default App;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const List = styled.ul`
  li {
    list-style: none;

    input:checked + span {
      text-decoration: line-through;
    }
  }
`;
