import { useEffect, useState } from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { todoController } from "@ui/controller/todo";

interface HomeTodo {
  id: string;
  content: string;
}

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [todos, setTodos] = useState<HomeTodo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const hasMorePages = totalPages > page;
  const hasNoTodos = !isLoading && todos.length === 0;

  useEffect(() => {
    setInitialLoadComplete(true);
    if (!initialLoadComplete) {
      todoController
        .get({ page })
        .then(({ todos, pages }) => {
          setTodos(todos);
          setTotalPages(pages);
        })
        .finally(() => setIsLoading(false));
    }
  }, []);

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
        <form>
          <input type="text" placeholder="Run, study..." />
          <button type="submit" aria-label="Add new item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input type="text" placeholder="Filter list, ex: Dentist" />
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
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{todo.id}</td>
                <td>{todo.content}</td>
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
