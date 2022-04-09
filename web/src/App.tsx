import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "react-query";
import { Suspense, useTransition } from "react";

import logo from "./logo.svg";

const queryClient = new QueryClient();

type GetResponse = {
  tasks: {
    id: string;
    description: string;
  }[];
};

const ToDoList = () => {
  const [isPending, startTransition] = useTransition();
  const { error, data, refetch } = useQuery<GetResponse>(
    "repoData",
    () => fetch("http://localhost:5000/api/tasks").then((res) => res.json()),
    {
      suspense: true,
    }
  );
  const { mutate } = useMutation(
    (id: string) =>
      fetch(`http://localhost:5000/api/task/${id}`, {
        method: "DELETE",
      }).then((res) => res.json()),
    {
      onSuccess: (_, id, _context) => {
        // const data = queryClient.getQueryData<GetResponse>("repoData");
        // if (data) {
        //   queryClient.setQueryData<GetResponse>("repoData", (old) => ({
        //     tasks: old?.tasks.filter((task) => task.id !== id) ?? [],
        //   }));
        // }
        refetch();
      },
    }
  );

  const handleDelete = (id: string) => {
    startTransition(() => {
      mutate(id);
    });
  };

  return (
    <ul>
      {data?.tasks.map((task) => (
        <li key={task.id}>
          {`id: ${task.id};description:${task.description}`}
          <button onClick={() => handleDelete(task.id)}>Delete</button>
        </li>
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
