import { NextApiRequest, NextApiResponse } from "next";
import { z as schema } from "zod";
import { todoRepository } from "@server/repository/todo";
import { HttpNotFoundError } from "@server/infra/errors";

async function get(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const page = Number(query.page);
  const limit = Number(query.limit);

  if (query.page && isNaN(page)) {
    res.status(400).json({
      error: {
        message: "`page` must be a number",
      },
    });
    return;
  }
  if (query.limit && isNaN(limit)) {
    res.status(400).json({
      error: {
        message: "`limit` must be a number",
      },
    });
    return;
  }

  const output = todoRepository.get({ page, limit });

  res.status(200).json({
    total: output.total,
    pages: output.pages,
    todos: output.todos,
  });
}

const TodoCreateBodySchema = schema.object({
  content: schema.string(),
});

async function create(req: NextApiRequest, res: NextApiResponse) {
  const body = TodoCreateBodySchema.safeParse(req.body);

  if (!body.success) {
    res.status(400).json({
      error: {
        message: "Content is required to create a new Todo",
        description: body.error.issues,
      },
    });
    return;
  }

  const createdTodo = await todoRepository.createByContent(body.data.content);

  res.status(201).json({
    todo: createdTodo,
  });
}

async function toggleDone(req: NextApiRequest, res: NextApiResponse) {
  const todoId = req.query.id;
  const parsedTodoId = schema.string().safeParse(todoId);

  if (!parsedTodoId.success) {
    res.status(400).json({
      error: {
        message: "You must provide a string ID",
        description: parsedTodoId.error.issues,
      },
    });
    return;
  }

  try {
    const updatedTodo = await todoRepository.toggleDone(parsedTodoId.data);

    res.status(200).json({
      todo: updatedTodo,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({
        error: {
          message: error.message,
        },
      });
    }
  }
}

async function deleteById(req: NextApiRequest, res: NextApiResponse) {
  const QuerySchema = schema.object({ id: schema.string().uuid().nonempty() });
  const parsedQuery = QuerySchema.safeParse(req.query);

  if (!parsedQuery.success) {
    res.status(400).json({
      error: {
        message: `You must provide a valid ID!`,
      },
    });
    return;
  }

  const todoId = parsedQuery.data.id;

  try {
    await todoRepository.deleteById(todoId);
    res.status(204).end();
  } catch (error) {
    if (error instanceof HttpNotFoundError) {
      res.status(error.status).json({
        error: {
          message: error.message,
        },
      });
    }

    res.status(500).json({
      error: {
        message: `Internal server error deleting resource ${todoId}`,
      },
    });
  }
}

export const todoController = { get, create, toggleDone, deleteById };
