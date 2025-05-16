import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import AppRoutes from "@/routes";
import { useWalletStore } from "@/store/useStore";
import { useEffect } from "react";
import RegisterUserModal from "@/components/modals/register-user-modal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function AppContent() {
  const {
    showRegisterModal,
    walletAddress,
    contractId,
    passkeyId,
    hasProfile,
    isConnected,
    checkUserProfile,
    setShowRegisterModal,
    fetchBalance,
    fetchTransactions,
  } = useWalletStore();

  useEffect(() => {
    if (isConnected && !hasProfile) {
      checkUserProfile();
    }
  }, [isConnected, hasProfile, checkUserProfile]);

  useEffect(() => {
    if (isConnected && walletAddress) {
      // Sync wallet data on app load
      Promise.all([fetchBalance(), fetchTransactions()]).catch((error) => {
        console.error("Error syncing wallet data:", error);
      });
    }
  }, [isConnected, walletAddress, fetchBalance, fetchTransactions]);

  const shouldShowRegisterModal = isConnected && !hasProfile;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background">
        <BrowserRouter>
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
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
