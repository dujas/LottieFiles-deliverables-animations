import "./index.css";
import AppRoutes from "@/app/routes/AppRoutes";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConfigsProvider from "./app/providers/configuration-provider";

const App = () => {
  const queryClient = new QueryClient();
  return (
    <ErrorBoundary fallback={<div>Something went wrong :(</div>}>
      <QueryClientProvider client={queryClient}>
        <ConfigsProvider>
          <AppRoutes />
        </ConfigsProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
export default App;
