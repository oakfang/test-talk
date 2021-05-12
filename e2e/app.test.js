/*global page*/
const { getDocument, queries, waitFor } = require("pptr-testing-library");

beforeEach(async () => {
  await page.goto("http://localhost:5000", {
    waitUntil: "networkidle0",
  });
});

test("App doesn't crash on startup", async () => {
  const app = await getApp();
  await expect(app.heading).toBeVisible();
}, 10000);

test("Todo textbox is focused on startup", async () => {
  const app = await getApp();
  await expect(app.emptyTextbox).toHaveFocus();
});

test("Form should be invalid while textbox is empty", async () => {
  const app = await getApp();

  await expect(app.emptyTextbox).not.toHaveValue();
  await expect(app.addTodoButton).toBeDisabled();
  expect(await app.allTodoItems).toHaveLength(3);
  app.typeIntoTextbox("{enter}");
  expect(await app.allTodoItems).toHaveLength(3);
});

test("Should add a todo item on form submit", async () => {
  const app = await getApp();

  await app.typeIntoTextbox("Foo bar{enter}");
  await waitFor(() => app.todoItemWithText("Foo bar"));
  await app.typeIntoTextbox("Spam buzz");
  await app.clickOnAddButton();
  await waitFor(() => app.todoItemWithText("Spam buzz"));
});

test("A freshly added todo item should not be editable", async () => {
  const app = await getApp();

  app.typeIntoTextbox("Foo bar{enter}");
  await waitFor(() => app.todoItemWithText("Foo bar"));
  await expect(app.todoItemWithText("Foo bar")).toBeDisabled();
  await waitFor(async () => {
    await expect(app.todoItemWithText("Foo bar")).not.toBeDisabled();
  });
});

test("Clicking on a todo item toggles it", async () => {
  const app = await getApp();

  await app.clickOnTodoItem(/take/i);
  await waitFor(async () => {
    await expect(app.todoItemWithText(/take/i)).toBeChecked();
  });
  await expect(app.todoItemWithText(/work/i)).not.toBeChecked();
});

async function getApp() {
  let document = await getDocument(page);
  const app = {
    get heading() {
      return queries.getByText(document, "Todo!");
    },

    get emptyTextbox() {
      return queries.getByPlaceholderText(document, /here/i);
    },

    get addTodoButton() {
      return queries.getByText(document, /add/i);
    },

    get todoList() {
      return queries.getByRole(document, "list");
    },

    get allTodoItems() {
      return this.todoList
        .then((list) => queries.getAllByRole(list, "listitem"))
        .catch(() => []);
    },

    async todoItemWithText(text) {
      return queries.getByLabelText(await app.todoList, text);
    },

    async typeIntoTextbox(text) {
      const textbox = await app.emptyTextbox;
      const lines = text.split("{enter}");
      await textbox.type(lines[0]);
      for (let line of lines.slice(1)) {
        await textbox.press("Enter");
        await textbox.type(line);
      }
    },

    async clickOnAddButton() {
      const btn = await app.addTodoButton;
      return btn.click();
    },

    async clickOnTodoItem(text) {
      const item = await app.todoItemWithText(text);
      return item.click();
    },

    async waitForFetchedTodos() {
      await page.reload({ waitUntil: "networkidle0" });
      document = await getDocument(page);
    },
  };

  return app;
}
