import { read, create } from "@db-crud-todo";
import { Todo } from "@ui/schema/todo";

interface TodoRepositoryGetParams {
  page?: number;
  limit?: number;
}
interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

function get({
  page = 1,
  limit = 10,
}: TodoRepositoryGetParams = {}): TodoRepositoryGetOutput {
  const ALL_TODOS = read().reverse();

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
  const totalPages = Math.ceil(ALL_TODOS.length / limit);

  return {
    total: ALL_TODOS.length,
    todos: paginatedTodos,
    pages: totalPages,
  };
}

async function createByContent(content: string): Promise<Todo> {
  return create(content);
}

export const todoRepository = {
  get,
  createByContent,
};
