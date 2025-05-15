import { Routes, Route } from "react-router-dom";
import { PasskeyProvider } from "@/context/PasskeyContext";
import Index from "@/pages/Index";
import Wallet from "@/pages/Wallet";
import Travel from "@/pages/Travel";
import Transactions from "@/pages/Transactions";
import Recommendations from "@/pages/Recommendations";
import NotFound from "@/pages/NotFound";

const AppRoutes = () => {
  return (
    <PasskeyProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PasskeyProvider>
  );
};

export default AppRoutes;
