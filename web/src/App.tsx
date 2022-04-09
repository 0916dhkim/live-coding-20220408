import "./App.css";

import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import { Suspense } from "react";
import logo from "./logo.svg";

const queryClient = new QueryClient();

const ToDoList = () => {
  const { error, data } = useQuery<{
    tasks: { id: string; description: string }[];
  }>(
    "repoData",
    () => fetch("http://localhost:5000/api/tasks").then((res) => res.json()),
    {
      suspense: true,
    }
  );
  return (
    <ul>
      {data?.tasks.map((task) => (
        <li>{task.description}</li>
      ))}
    </ul>
  );
};

const Root = () => (
  <div className="App">
    <Suspense fallback={<p>Loading...</p>}>
      <ToDoList />
    </Suspense>
  </div>
);

function App() {
  return (
    // @ts-ignore
    <QueryClientProvider client={queryClient}>
      <Root />
    </QueryClientProvider>
  );
}

export default App;
