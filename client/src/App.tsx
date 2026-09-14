import { Toaster } from "@/components/ui/toast.tsx";
import AppRouter from "@/router/app-router.tsx";

const App = () => {
  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  );
};

export default App;
