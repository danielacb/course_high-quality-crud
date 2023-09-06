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

export const todoController = {
  get,
};
