import {
  render,
  screen,
  getAllByRole,
  waitForElementToBeRemoved,
  getByLabelText,
  waitFor,
} from "@testing-library/react";
import user from "@testing-library/user-event";
import { defaultClient } from "./query";
import { createMockServer } from "./mock-server";
import App from "./App";

let testServer = null;
beforeEach(() => {
  defaultClient.resetQueries();
  testServer = createMockServer({ environment: "test" });
  return testServer;
});
afterEach(() => {
  return testServer.shutdown();
});

test("App doesn't crash on startup", () => {
  const app = getApp();

  expect(app.heading).toBeVisible();
});

test("Todo textbox is focused on startup", () => {
  const app = getApp();

  expect(app.emptyTextbox).toHaveFocus();
});

test("Form should be invalid while textbox is empty", async () => {
  const app = getApp();

  expect(app.emptyTextbox).not.toHaveValue();
  expect(app.addTodoButton).toBeDisabled();
  await app.waitForFetchedTodos();
  expect(app.allTodoItems).toHaveLength(0);
  app.typeIntoTextbox("{enter}");
  expect(app.allTodoItems).toHaveLength(0);
});

test("Should fetch todos list", async () => {
  const todos = [
    { done: false, text: "Walk the dog" },
    { done: false, text: "Do the thing" },
  ];
  todos.forEach((todo) => testServer.create("todo", todo));
  const app = getApp();

  await app.waitForFetchedTodos();
  expect(app.allTodoItems).toHaveLength(2);
  todos.forEach((todo) => {
    expect(app.todoItemWithText(todo.text)).not.toBeChecked();
  });
});

test("Should add a todo item on form submit", async () => {
  const app = getApp();

  await app.waitForFetchedTodos();
  app.typeIntoTextbox("Foo bar{enter}");
  await waitFor(() => app.todoItemWithText("Foo bar"));
  app.typeIntoTextbox("Spam buzz");
  app.clickOnAddButton();
  await waitFor(() => app.todoItemWithText("Spam buzz"));
});

test("A freshly added todo item should not be editable", async () => {
  const app = getApp();

  await app.waitForFetchedTodos();
  app.typeIntoTextbox("Foo bar{enter}");
  await waitFor(() => app.todoItemWithText("Foo bar"));
  expect(app.todoItemWithText("Foo bar")).toBeDisabled();
  await waitFor(() => {
    expect(app.todoItemWithText("Foo bar")).not.toBeDisabled();
  });
});

test("Clicking on a todo item toggles it", async () => {
  const todos = [
    { done: false, text: "Walk the dog" },
    { done: false, text: "Do the thing" },
  ];
  todos.forEach((todo) => testServer.create("todo", todo));
  const app = getApp();

  await app.waitForFetchedTodos();
  app.clickOnTodoItem(/walk/i);
  await waitFor(() => {
    expect(app.todoItemWithText(/walk/i)).toBeChecked();
  });
  expect(app.todoItemWithText(/thing/i)).not.toBeChecked();
});

function getApp() {
  render(<App />);
  const app = {
    get heading() {
      return screen.getByText("Todo!");
    },

    get emptyTextbox() {
      return screen.getByPlaceholderText(/here/i);
    },

    get addTodoButton() {
      return screen.getByText(/add/i);
    },

    get todoList() {
      return screen.getByRole("list");
    },

    get allTodoItems() {
      try {
        return getAllByRole(this.todoList, "listitem");
      } catch {
        return [];
      }
    },

    todoItemWithText(text) {
      return getByLabelText(app.todoList, text);
    },

    typeIntoTextbox(text) {
      user.type(app.emptyTextbox, text);
    },

    clickOnAddButton() {
      user.click(app.addTodoButton);
    },

    clickOnTodoItem(text) {
      user.click(app.todoItemWithText(text));
    },

    async waitForFetchedTodos() {
      if (screen.queryByText(/loading/i)) {
        await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
      }
    },
  };

  return app;
}
