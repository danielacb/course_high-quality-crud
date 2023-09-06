import { read } from "@db-crud-todo";

interface Todo {
  id: string;
  content: string;
  date: string;
  done: boolean;
}

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
  const ALL_TODOS = read();

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

export const todoRepository = {
  get,
};
