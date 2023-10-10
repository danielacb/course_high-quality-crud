const BASE_URL = "http://localhost:3000";

describe("/ - Todos Feed", () => {
  it("should render the page when page is loaded", () => {
    cy.visit(BASE_URL);
    cy.get("h1").should("contain.text", `What's the plan for today?`);
  });
  it("should create a new todo and display it on the page", () => {
    // 0 - Interceptions
    cy.intercept("POST", `${BASE_URL}/api/todos`, (request) => {
      request.reply({
        statusCode: 201,
        body: {
          todo: {
            id: "70905d7e-c969-45b1-99f0-1aa155477204",
            date: "2023-04-15T19:46:51.109Z",
            content: "Test todo Cypress",
            done: false,
          },
        },
      });
    }).as("createTodo");

    // 1 - Open page
    cy.visit(BASE_URL);
    // 2 - Select input to create a new todo
    const inputAddTodo = "input[name='add-todo']";
    cy.get(inputAddTodo).type("Test todo Cypress");
    // 3 - Submit todo
    const btnAddTodo = "[aria-label='Add new item']";
    cy.get(btnAddTodo).click();

    // 4 - Confirm if todo was added
    cy.get("table > tbody").contains("Test todo Cypress", { timeout: 5000 });
  });
});
