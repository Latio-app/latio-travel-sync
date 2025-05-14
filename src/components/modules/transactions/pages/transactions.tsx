import { useState } from "react";
import PageContainer from "@/components/layout/page-container";
import Navbar from "@/components/layout/navbar";
import TransactionList from "@/components/transactions/transaction-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Transaction } from "@/@types";

const mockTransactions: Transaction[] = [
  {
    id: "tx1",
    amount: 50,
    asset: "XLM",
    type: "send" as const,
    description: "Payment for dinner",
    recipient: "Alex",
    status: "completed" as const,
    timestamp: new Date().toISOString(),
    txHash: "hash123456789abcdef",
    _base: {},
  },
  {
    id: "tx2",
    amount: 100,
    asset: "XLM",
    type: "receive" as const,
    description: "Refund from hotel",
    recipient: "Hotel Booking",
    status: "completed" as const,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    txHash: "hash987654321fedcba",
    _base: {},
  },
  {
    id: "tx3",
    amount: 30,
    asset: "XLM",
    type: "swap" as const,
    description: "XLM to USD",
    recipient: "Exchange",
    status: "completed" as const,
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    txHash: "hashswap123456789",
    _base: {},
  },
  {
    id: "tx4",
    amount: 20,
    asset: "XLM",
    type: "send" as const,
    description: "Souvenir shopping",
    travelReference: "Mexico City Trip",
    recipient: "Local Shop",
    status: "pending" as const,
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    txHash: "hashpending987654321",
    _base: {},
  },
  {
    id: "tx5",
    amount: 15,
    asset: "XLM",
    type: "send" as const,
    description: "Taxi fare",
    travelReference: "Mexico City Trip",
    recipient: "Taxi Driver",
    status: "completed" as const,
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    txHash: "hashtaxi123456789",
    _base: {},
  },
  {
    id: "tx6",
    amount: 200,
    asset: "XLM",
    type: "receive" as const,
    description: "Freelance payment",
    recipient: "Client ABC",
    status: "completed" as const,
    timestamp: new Date(Date.now() - 432000000).toISOString(),
    txHash: "hashclient987654321",
    _base: {},
  },
];

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Apply filters
  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesSearch =
      !searchTerm ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.travelReference &&
        tx.travelReference.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = !typeFilter || tx.type === typeFilter;
    const matchesStatus = !statusFilter || tx.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <>
      <PageContainer
        title="Transaction History"
        subtitle="View and track all your transactions"
      >
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by description, recipient..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={typeFilter || ""}
              onValueChange={(value) => setTypeFilter(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="send">Sent</SelectItem>
                <SelectItem value="receive">Received</SelectItem>
                <SelectItem value="swap">Swapped</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter || ""}
              onValueChange={(value) => setStatusFilter(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchTerm || typeFilter || statusFilter) && (
            <div className="flex justify-end mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter(null);
                  setStatusFilter(null);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Transaction list */}
        <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <TransactionList transactions={filteredTransactions} />

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No transactions found matching your filters
              </p>
            </div>
          )}
        </div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default Transactions;
