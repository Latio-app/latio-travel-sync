import { Link, useLocation } from "react-router-dom";
import { Wallet, Map, Clock, Lightbulb, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePasskey } from "@/context/PasskeyContext";
const Navbar = () => {
  const location = useLocation();
  const { isConnected, connect } = usePasskey();
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

  const formatPublicKey = (key: string) => {
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:top-0 md:bottom-auto md:shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo for desktop */}
          <div className="hidden md:block">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg latio-gradient flex items-center justify-center">
                <span className="font-bold text-white">L</span>
              </div>
              <span className="font-bold text-gray-800">Latio</span>
            </Link>
          </div>

          {/* Navigation links */}
          <div className="flex items-center justify-between w-full md:w-auto md:justify-start md:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-1 px-1 md:px-3 py-1 md:py-2 rounded-md transition-colors",
                  location.pathname === link.path
                    ? "text-latio-blue font-medium"
                    : "text-gray-500 hover:text-latio-blue hover:bg-blue-50"
                )}
              >
                {link.icon}
                <span className="text-xs md:text-sm">{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Wallet connection */}
          <div className="hidden md:block ml-auto">
            {isConnected ? (
              <p>Connected</p>
            ) : (
              <Button
                onClick={connect}
                className="bg-latio-blue hover:bg-blue-600 text-white"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
