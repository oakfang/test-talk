import { useQuery, useMutation, useQueryClient } from "react-query";
import { getTodos, createTodo, updateTodo } from "./api";

export function useTodosList() {
  const query = useQuery("todos", getTodos);
  const ready = !query.isLoading;
  const todos = query.data ?? [];

  return { ready, todos };
}

export function useTodosService() {
  const queryClient = useQueryClient();
  const createTodoMutation = useMutation(createTodo, {
    onMutate: async (text) => {
      await queryClient.cancelQueries("todos");
      const previousTodos = queryClient.getQueryData("todos");
      queryClient.setQueryData("todos", (old) => [
        ...old,
        { text, done: false, id: -Math.random() },
      ]);

      return { previousTodos };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData("todos", context.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries("todos");
    },
  });
  const createTodoManipulation = (text) => createTodoMutation.mutate(text);

  const updateTodoMutation = useMutation(updateTodo, {
    onMutate: async ({ id, update }) => {
      await queryClient.cancelQueries("todos");
      const previousTodos = queryClient.getQueryData("todos");
      const idx = previousTodos.findIndex((todo) => todo.id === id);
      queryClient.setQueryData("todos", (old) => [
        ...old.slice(0, idx),
        { ...old[idx], ...update },
        ...old.slice(idx + 1),
      ]);

      return { previousTodos };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData("todos", context.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries("todos");
    },
  });
  const updateTodoManipulation = (id, update) =>
    updateTodoMutation.mutate({ id, update });
  return {
    createTodo: createTodoManipulation,
    updateTodo: updateTodoManipulation,
  };
}
