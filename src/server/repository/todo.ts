import { supabase } from "@server/infra/supabase";
import { Todo, TodoSchema } from "@server/schema/todo";
import { HttpNotFoundError } from "@server/infra/errors";

interface TodoRepositoryGetParams {
  page?: number;
  limit?: number;
}
interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

async function get({
  page,
  limit,
}: TodoRepositoryGetParams = {}): Promise<TodoRepositoryGetOutput> {
  const currentPage = page || 1;
  const currentLimit = limit || 10;
  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = currentPage * currentLimit - 1;

  const { data, error, count } = await supabase
    .from("todos")
    .select("*", {
      count: "exact",
    })
    .order("date", { ascending: false })
    .range(startIndex, endIndex);

  if (error) throw new Error("Failed to fetch TODOs data!");

  const parsedData = TodoSchema.array().safeParse(data);

  if (!parsedData.success)
    throw new Error("Failed to parse TODOs from database");

  const todos = parsedData.data;
  const total = count || todos.length;
  const pages = Math.ceil(total / currentLimit);

  return {
    todos,
    total,
    pages,
  };
}

async function createByContent(content: string): Promise<Todo> {
  const { data, error } = await supabase
    .from("todos")
    .insert([
      {
        content,
      },
    ])
    .select()
    .single();

  if (error) throw new Error("Failed to create new TODO");

  const parsedData = TodoSchema.parse(data);
  return parsedData;
}

async function getTodoById(todoId: string): Promise<Todo> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("id", todoId)
    .single();

  if (error) throw new Error("Failed to get TODO by id");

  const parsedData = TodoSchema.safeParse(data);
  if (!parsedData.success) throw new Error("Failed to parse TODO created");

  return parsedData.data;
}

async function toggleDone(todoId: string): Promise<Todo> {
  const todo = await getTodoById(todoId);

  const { data, error } = await supabase
    .from("todos")
    .update({
      done: !todo.done,
    })
    .eq("id", todoId)
    .select()
    .single();

  if (error) throw new Error("Failed to update TODO done status");

  const parsedData = TodoSchema.safeParse(data);
  if (!parsedData.success) {
    throw new Error("Failed to return updated todo");
  }

  return parsedData.data;
}

async function deleteById(todoId: string) {
  const { error } = await supabase.from("todos").delete().match({ id: todoId });
  if (error) throw new HttpNotFoundError(`Todo with ID ${todoId} not found!`);
}

export const todoRepository = {
  get,
  createByContent,
  toggleDone,
  deleteById,
  getTodoById,
};
