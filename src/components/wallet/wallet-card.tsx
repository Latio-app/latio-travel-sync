
import { WalletBalance } from "@/@types";
import LatioCard from "../ui/latio-card";
import { ArrowRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WalletCardProps {
  balance: WalletBalance;
  onSend?: () => void;
  onSwap?: () => void;
  onSync?: () => void;
  className?: string;
}

const WalletCard = ({
  balance,
  onSend,
  onSwap,
  onSync,
  className,
}: WalletCardProps) => {
  if (!balance) {
    return null; // Safety check to prevent rendering with null balance
  }

  return (
    <LatioCard className={cn("relative overflow-hidden", className)}>
      {/* Background gradient */}
      <div className="absolute inset-0 latio-gradient opacity-90 z-0" />

      <div className="relative z-10 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="h-5 w-5" />
          <h3 className="font-semibold">Your Balance</h3>
        </div>

        <div className="mb-6">
          <p className="text-3xl font-bold mb-1">
            {balance.xlm.toFixed(2)} XLM
          </p>
          <p className="text-sm opacity-80">
            ≈ {balance.localAmount.toFixed(2)} {balance.preferredCurrency}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30"
            onClick={onSend}
          >
            Send
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30"
            onClick={onSwap}
          >
            Swap
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30 ml-auto"
            onClick={onSync}
          >
            Sync
          </Button>
        </div>
      </div>
    </LatioCard>
  );
};

export default WalletCard;
