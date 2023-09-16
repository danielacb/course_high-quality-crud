import { z as schema } from "zod";
import { Todo, TodoSchema } from "@ui/schema/todo";

interface TodoRepositoryGetParams {
  page: number;
  limit: number;
}
interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}
function get({
  page,
  limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
  return fetch(`/api/todos?page=${page}&limit=${limit}`).then(
    async (response) => {
      const todosString = await response.text();
      const parsedResponse = parseTodosFromServer(JSON.parse(todosString));

      return {
        total: parsedResponse.total,
        todos: parsedResponse.todos,
        pages: parsedResponse.pages,
      };
    },
  );
}

async function createByContent(content: string): Promise<Todo> {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: {
      // MIME Type
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
    }),
  });

  if (response.ok) {
    const serverResponse = await response.json();

    const ServerResponseSchema = schema.object({
      todo: TodoSchema,
    });
    const serverResponseParsed = ServerResponseSchema.safeParse(serverResponse);

    if (!serverResponseParsed.success) {
      throw new Error("Failed to create TODO!");
    }

    return serverResponseParsed.data.todo;
  }

  throw new Error("Failed to create TODO :(");
}

async function toggleDone(todoId: string): Promise<Todo> {
  const response = await fetch(`/api/todos/${todoId}/toggle-done`, {
    method: "PUT",
  });

  if (response.ok) {
    const serverResponse = await response.json();

    const ServerResponseSchema = schema.object({
      todo: TodoSchema,
    });
    const serverResponseParsed = ServerResponseSchema.safeParse(serverResponse);

    if (!serverResponseParsed.success) {
      throw new Error(`Failed to update TODO with id: ${todoId}`);
    }

    return serverResponseParsed.data.todo;
  }

  throw new Error(
    `Server Error: unable to toggle done todo with id: ${todoId}`,
  );
}

export const todoRepository = {
  get,
  createByContent,
  toggleDone,
};

function parseTodosFromServer(responseBody: unknown): {
  total: number;
  pages: number;
  todos: Todo[];
} {
  if (
    responseBody !== null &&
    typeof responseBody === "object" &&
    "todos" in responseBody &&
    "total" in responseBody &&
    "pages" in responseBody &&
    Array.isArray(responseBody.todos)
  ) {
    return {
      total: Number(responseBody.total),
      pages: Number(responseBody.pages),
      todos: responseBody.todos.map((todo: unknown) => {
        if (todo === null && typeof todo !== "object") {
          throw new Error("Invalid todo from API");
        }

        const { id, content, done, date } = todo as {
          id: string;
          content: string;
          date: string;
          done: string;
        };

        return {
          id,
          content,
          done: String(done).toLowerCase() === "true",
          date: date,
        };
      }),
    };
  }

  return {
    pages: 1,
    total: 0,
    todos: [],
  };
}
