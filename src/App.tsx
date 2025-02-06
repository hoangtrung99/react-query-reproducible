import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { queryClient } from "./lib/react-query";
import { TodoList } from "./components/TodoList";
import "./App.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <TodoList />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
