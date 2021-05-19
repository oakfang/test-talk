import { QueryClient, QueryClientProvider } from "react-query";

export const defaultClient = new QueryClient();

export const QueryProvider = ({ children, client = defaultClient }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);
