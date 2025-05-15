import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Wallet,
  Map,
  Clock,
  Lightbulb,
  LayoutDashboard,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/store/useStore";
import { useTheme } from "../../components/theme-provider";

const Navbar = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const {
    walletAddress,
    connected,
    loading,
    connectWallet,
    disconnectWallet,
    loadWalletFromStorage,
  } = useWalletStore();

  React.useEffect(() => {
    loadWalletFromStorage();
  }, []);

  const app = "stellar-dapp";
  const user = "user@example.com";

  const formatPublicKey = (key: string) => {
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  const navLinks = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Wallet",
      path: "/wallet",
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      name: "Travel",
      path: "/travel",
      icon: <Map className="h-5 w-5" />,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      name: "Recommendations",
      path: "/recommendations",
      icon: <Lightbulb className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:top-0 md:bottom-auto md:shadow-sm z-50 dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="hidden md:block">
            <Link to="/" className="flex items-center gap-2">
              <img src="/latio.svg" alt="Latio" width={100} height={100} />
            </Link>
          </div>

          <div className="flex items-center justify-between w-full md:w-auto md:justify-start md:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-1 px-1 md:px-3 py-1 md:py-2 rounded-md transition-colors",
                  location.pathname === link.path
                    ? "text-latio-blue font-medium"
                    : "text-gray-500 hover:text-latio-blue hover:bg-blue-50 dark:text-gray-400 dark:hover:text-latio-blue dark:hover:bg-gray-800"
                )}
              >
                {link.icon}
                <span className="text-xs md:text-sm">{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="dark:text-white"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {connected ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-700 dark:text-gray-300">
                  {formatPublicKey(walletAddress!)}
                </span>
                <Button
                  onClick={disconnectWallet}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => connectWallet(app, user)}
                disabled={loading}
                className="bg-latio-blue hover:bg-blue-600 text-white"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {loading ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
