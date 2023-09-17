import { z as schema } from "zod";
import { Todo } from "@ui/schema/todo";
import { todoRepository } from "@ui/repository/todo";

interface TodoControllerGetParams {
  page?: number;
}

async function get({ page = 1 }: TodoControllerGetParams) {
  return todoRepository.get({
    page,
    limit: 2,
  });
}

function filterTodosByContent<Todo>(
  search: string,
  todos: Array<Todo & { content: string }>,
): Array<Todo> {
  const homeTodos = todos.filter((todo) => {
    const searchNormalized = search.toLowerCase();
    const contentNormalized = todo.content.toLowerCase();
    return contentNormalized.includes(searchNormalized);
  });

  return homeTodos;
}

interface TodoControllerCreateParams {
  content?: string;
  onError: (customMessage?: string) => void;
  onSuccess: (todo: Todo) => void;
}

function create({ content, onSuccess, onError }: TodoControllerCreateParams) {
  const parsedParams = schema.string().nonempty().safeParse(content);
  if (!parsedParams.success) {
    onError();
    return;
  }

  todoRepository
    .createByContent(parsedParams.data)
    .then((newTodo) => {
      onSuccess(newTodo);
    })
    .catch(() => {
      onError();
    });
}

interface TodoControllerToggleDoneParams {
  todoId: string;
  updateTodoDoneOnScreen: (todoId: string) => void;
  onError: (customMessage?: string) => void;
}

function toggleDone({
  todoId,
  updateTodoDoneOnScreen,
  onError,
}: TodoControllerToggleDoneParams) {
  todoRepository
    .toggleDone(todoId)
    .then(() => updateTodoDoneOnScreen(todoId))
    .catch(() => onError());
}

async function deleteById(todoId: string): Promise<void> {
  try {
    await todoRepository.deleteById(todoId);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`error: ${error.message}`);
    }
  }
}

export const todoController = {
  get,
  filterTodosByContent,
  create,
  toggleDone,
  deleteById,
};
