
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface LatioCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

const LatioCard = ({ children, className, onClick, interactive = true }: LatioCardProps) => {
  return (
    <div
      className={cn(
        "latio-card p-4",
        interactive && "interactive-card",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default LatioCard;
