import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import AppRoutes from "@/routes";
import { useWalletStore } from "@/store/useStore";
import { RegisterUserModal } from "@/components/modals/register-user-modal";

function App() {
  const { showRegisterModal, setShowRegisterModal, walletAddress, contractId } =
    useWalletStore();

  return (
    <ThemeProvider defaultTheme="light" storageKey="latio-theme">
      <Router>
        <AppRoutes />
        <Toaster />
        {showRegisterModal && (
          <RegisterUserModal
            isOpen={showRegisterModal}
            onClose={() => setShowRegisterModal(false)}
            walletAddress={walletAddress || ""}
            contractId={contractId || ""}
          />
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
