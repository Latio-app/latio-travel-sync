import PageContainer from "@/components/layout/page-container";
import Navbar from "@/components/layout/navbar";
import { WalletDashboard } from "@/components/wallet/WalletDashboard";
import { SendPaymentForm } from "@/components/wallet/SendPaymentForm";
import { TransactionList } from "@/components/wallet/TransactionList";
import { useWalletStore } from "@/store/useStore";

const WalletPage = () => {
  const { fetchBalance, fetchTransactions } = useWalletStore();

  const handleSync = async () => {
    await Promise.all([fetchBalance(), fetchTransactions()]);
  };

  return (
    <>
      <PageContainer
        title="Wallet"
        subtitle="Manage your Stellar payments and transactions"
      >
        <div className="space-y-6">
          <WalletDashboard onRefresh={handleSync} />
          <SendPaymentForm />
          <TransactionList />
        </div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default WalletPage;
