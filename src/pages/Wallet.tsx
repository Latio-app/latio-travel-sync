import { Wallet as WalletModule } from "@/components/modules/wallet";
import { TestPasskey } from "@/components/test-passkey";
import PageContainer from "@/components/layout/page-container";

const Wallet = () => {
  return (
    <PageContainer
      title="Wallet"
      subtitle="Manage your wallet and transactions"
    >
      <TestPasskey />
      <WalletModule />
    </PageContainer>
  );
};

export default Wallet;
