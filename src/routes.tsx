import { Routes, Route } from "react-router-dom";
import { PasskeyProvider } from "@/context/PasskeyContext";
import LandingPage from "@/components/modules/auth/pages/landing";
import Index from "@/pages/Index";
import Wallet from "@/pages/Wallet";
import Travel from "@/components/modules/travel/pages/travel";
import TravelDetails from "@/components/modules/travel/pages/travel-details";
import Transactions from "@/pages/Transactions";
import Recommendations from "@/pages/Recommendations";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const AppRoutes = () => {
  return (
    <PasskeyProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/travel"
          element={
            <ProtectedRoute>
              <Travel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/travel/:travelId"
          element={
            <ProtectedRoute>
              <TravelDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PasskeyProvider>
  );
};

export default AppRoutes;
