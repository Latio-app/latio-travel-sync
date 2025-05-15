import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import AppRoutes from "@/routes";
import { useWalletStore } from "@/store/useStore";
import { useEffect } from "react";
import RegisterUserModal from "@/components/modals/register-user-modal";

function App() {
  const {
    showRegisterModal,
    walletAddress,
    contractId,
    passkeyId,
    hasProfile,
    isConnected,
    checkUserProfile,
    setShowRegisterModal,
  } = useWalletStore();

  useEffect(() => {
    if (isConnected && !hasProfile) {
      checkUserProfile();
    }
  }, [isConnected, hasProfile, checkUserProfile]);

  const shouldShowRegisterModal = isConnected && !hasProfile;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background">
        <Router>
          <AppRoutes />
          <Toaster />
          <RegisterUserModal
            isOpen={shouldShowRegisterModal}
            walletAddress={walletAddress || ""}
            contractId={contractId || ""}
            passkeyId={passkeyId || ""}
            onClose={() => setShowRegisterModal(false)}
            onRegistered={() => {
              window.location.reload();
            }}
          />
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
