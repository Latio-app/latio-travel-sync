import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import AppRoutes from "@/routes";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="latio-theme">
      <Router>
        <AppRoutes />
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
