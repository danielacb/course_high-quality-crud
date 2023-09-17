import {
  deleteById as dbDeleteById,
  read,
  create,
  update,
} from "@db-crud-todo";
import { HttpNotFoundError } from "@server/infra/errors";
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
  page,
  limit,
}: TodoRepositoryGetParams = {}): TodoRepositoryGetOutput {
  const currentPage = page || 1;
  const currentLimit = limit || 10;

  const ALL_TODOS = read().reverse();

  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = currentPage * currentLimit;
  const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
  const totalPages = Math.ceil(ALL_TODOS.length / currentLimit);

  return {
    total: ALL_TODOS.length,
    todos: paginatedTodos,
    pages: totalPages,
  };
}

async function createByContent(content: string): Promise<Todo> {
  return create(content);
}

async function toggleDone(id: string): Promise<Todo> {
  const ALL_TODOS = read();
  const todo = ALL_TODOS.find((todo) => todo.id === id);

  if (!todo) throw new Error(`Todo with ID ${id} not found!`);

  const updatedTodo = update(id, {
    done: !todo.done,
  });

  return updatedTodo;
}

async function deleteById(todoId: string) {
  const ALL_TODOS = read();
  const todo = ALL_TODOS.find((todo) => todo.id === todoId);

  if (!todo) throw new HttpNotFoundError(`Todo with ID ${todoId} not found!`);

  dbDeleteById(todoId);
}

export const todoRepository = {
  get,
  createByContent,
  toggleDone,
  deleteById,
};
