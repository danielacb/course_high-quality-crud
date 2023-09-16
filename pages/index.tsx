import { FormEvent, useEffect, useRef, useState } from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { todoController } from "@ui/controller/todo";

interface HomeTodo {
  id: string;
  content: string;
  done: boolean;
}

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState<HomeTodo[]>([]);
  const initialLoadComplete = useRef(false);
  const [newTodoContent, setNewTodoContent] = useState("");

  const hasMorePages = totalPages > page;
  const homeTodos = todoController.filterTodosByContent<HomeTodo>(
    search,
    todos,
  );
  const hasNoTodos = !isLoading && homeTodos.length === 0;

  useEffect(() => {
    if (!initialLoadComplete.current) {
      todoController
        .get({ page })
        .then(({ todos, pages }) => {
          setTodos(todos);
          setTotalPages(pages);
        })
        .finally(() => {
          setIsLoading(false);
          initialLoadComplete.current = true;
        });
    }
  }, []);

  function createNewTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    todoController.create({
      content: newTodoContent,
      onSuccess(todo: HomeTodo) {
        setTodos((oldTodos) => {
          return [todo, ...oldTodos];
        });
        setNewTodoContent("");
      },
      onError(customMessage) {
        alert(customMessage || "A todo needs to have content!");
      },
    });
  }

  function updateTodoDoneOnScreen(todoId: string) {
    setTodos((currentTodos) =>
      currentTodos.map((curretnTodo) => {
        if (curretnTodo.id === todoId) {
          return {
            ...curretnTodo,
            done: !curretnTodo.done,
          };
        }
        return curretnTodo;
      }),
    );
  }

  return (
    <main>
      <GlobalStyles themeName="devsoutinho" />
      <header
        style={{
          backgroundImage: `url('/bg.jpeg')`,
        }}
      >
        <div className="typewriter">
          <h1>What&apos;s the plan for today?</h1>
        </div>
        <form onSubmit={(event) => createNewTodo(event)}>
          <input
            type="text"
            value={newTodoContent}
            placeholder="Run, study..."
            onChange={(event) => setNewTodoContent(event.target.value)}
          />
          <button type="submit" aria-label="Add new item">
            +
          </button>
        </form>
      </header>

      <section>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Filter list, ex: Dentist"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </form>

        <table border={1}>
          <thead>
            <tr>
              <th align="left">
                <input type="checkbox" disabled />
              </th>
              <th align="left">Id</th>
              <th align="left">Content</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {homeTodos.map((todo) => (
              <tr key={todo.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() =>
                      todoController.toggleDone({
                        todoId: todo.id,
                        updateTodoDoneOnScreen,
                        onError(customMessage) {
                          alert(
                            customMessage ||
                              "Error when updating the todo done status",
                          );
                        },
                      })
                    }
                  />
                </td>
                <td>{todo.id.substring(0, 4)}</td>
                <td>{todo.done ? <s>{todo.content}</s> : todo.content}</td>
                <td align="right">
                  <button data-type="delete">Delete</button>
                </td>
              </tr>
            ))}

            {isLoading && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            )}

            {hasNoTodos && (
              <tr>
                <td colSpan={4} align="center">
                  No items found
                </td>
              </tr>
            )}

            {hasMorePages && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  Page: {page}
                  <button
                    data-type="load-more"
                    onClick={() => {
                      setIsLoading(true);
                      const nextPage = page + 1;
                      setPage(nextPage);
                      todoController
                        .get({ page: nextPage })
                        .then(({ todos, pages }) => {
                          setTodos((oldTodos) => [...oldTodos, ...todos]);
                          setTotalPages(pages);
                        })
                        .finally(() => setIsLoading(false));
                    }}
                    style={{ marginLeft: "16px" }}
                  >
                    Load more{" "}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "4px",
                        fontSize: "1.2em",
                      }}
                    >
                      ↓
                    </span>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
