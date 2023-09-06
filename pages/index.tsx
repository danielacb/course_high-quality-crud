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

  const hasMorePages = totalPages > page;

  useEffect(() => {
    todoController.get({ page }).then(({ todos, pages }) => {
      setTodos((oldTodos) => [...oldTodos, ...todos]);
      setTotalPages(pages);
    });
  }, [page]);

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

            <tr>
              <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>

            <tr>
              <td colSpan={4} align="center">
                No items found
              </td>
            </tr>

            {hasMorePages && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  Page: {page}
                  <button
                    data-type="load-more"
                    onClick={() => setPage(page + 1)}
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
