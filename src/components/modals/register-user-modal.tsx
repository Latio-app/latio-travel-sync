import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUserProfile } from "@/api/userProfile";
import { useWalletStore } from "@/store/useStore";

interface RegisterUserModalProps {
  passkeyId: string;
  walletAddress: string;
  contractId: string;
  isOpen: boolean;
  onClose: () => void;
  onRegistered: () => void;
}

export default function RegisterUserModal({
  passkeyId,
  walletAddress,
  contractId,
  isOpen,
  onClose,
  onRegistered,
}: RegisterUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setHasProfile = useWalletStore((state) => state.setHasProfile);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Prevent closing with Escape key
        e.preventDefault();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await createUserProfile(passkeyId, walletAddress, name, email);
      setHasProfile(true);
      onRegistered();
    } catch (error: any) {
      setError(error.message || "Failed to create profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 w-[425px] max-w-[90vw] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Complete Your Profile</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Please complete your profile to continue using the application.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="mt-1"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
