import { createServer, Model } from "miragejs";

export function createMockServer({ environment = "development" } = {}) {
  return createServer({
    environment,

    models: {
      todo: Model,
    },

    seeds(server) {
      server.create("todo", { done: true, text: "Walk the dog" });
      server.create("todo", { done: false, text: "Take out the trash" });
      server.create("todo", { done: false, text: "Work out" });
    },

    routes() {
      this.get("/api/todos", (schema) => {
        return schema.todos.all();
      });

      this.post("/api/todos", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);

        return schema.todos.create(attrs);
      });

      this.patch("/api/todos/:id", (schema, request) => {
        const { id } = request.params;
        const attrs = JSON.parse(request.requestBody);
        const todo = schema.todos.find(id);

        return todo.update(attrs);
      });
    },
  });
}
