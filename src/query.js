import { QueryClient, QueryClientProvider } from "react-query";

const defaultClient = new QueryClient();

export const QueryProvider = ({ children, client = defaultClient }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);
