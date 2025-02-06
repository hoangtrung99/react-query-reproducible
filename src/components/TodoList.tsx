import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { useSuspenseQueryDeferred } from "../hooks/useSuspenseQueryDeferred";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  return response.json();
}

const todosQuery = () =>
  queryOptions({
    queryKey: ["todos"],
    queryFn: () => fetchTodos(),
    placeholderData: keepPreviousData,
  });

const useTodos = () => {
  return useSuspenseQueryDeferred(todosQuery());
};

export function TodoList() {
  const { data } = useTodos();

  console.log(1111, data);

  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {data.map((todo) => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.completed} readOnly />
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
