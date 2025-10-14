import { useState } from "react";
import { transactionStats as initialTransactionStats, transactions as initialTransactions } from "@/data/dummyData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, XCircle, Eye, Send, Search } from "lucide-react";
import { toast } from "sonner";

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [commissionRate, setCommissionRate] = useState(0.2);
  const [purchasePlatform, setPurchasePlatform] = useState("");
  const [payoutNotes, setPayoutNotes] = useState("");
  const [transactionStats, setTransactionStats] = useState(initialTransactionStats);
  const [transactions, setTransactions] = useState(initialTransactions);

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenPayoutModal = (transaction: any) => {
    setSelectedTransaction(transaction);
    setCommissionRate(0.2);
    setPurchasePlatform("");
    setPayoutNotes("");
    setPayoutModalOpen(true);
  };

  const handleConfirmPayout = () => {
    if (!selectedTransaction) return;

    const commissionAmount = selectedTransaction.amount * (commissionRate / 100);
    const finalPayout = selectedTransaction.amount - commissionAmount;

    // Update transaction status to Paid
    setTransactions(prev => prev.map(t =>
      t.id === selectedTransaction.id ? { ...t, status: "Paid" } : t
    ));

    // Update stats
    const newTotalPayout = parseInt(transactionStats.totalPayout.replace(/[₦,]/g, '')) + finalPayout;
    const newWalletBalance = parseInt(transactionStats.walletBalance.replace(/[₦,]/g, '')) - finalPayout;
    const newProfit = parseInt(transactionStats.totalIncome.replace(/[₦,]/g, '')) - newTotalPayout;

    setTransactionStats({
      ...transactionStats,
      totalPayout: `₦${newTotalPayout.toLocaleString()}`,
      walletBalance: `₦${newWalletBalance.toLocaleString()}`,
      profit: `₦${newProfit.toLocaleString()}`,
    });

    toast.success(`Payout sent successfully to ${selectedTransaction.user}!`, {
      description: `Transaction ID: ${selectedTransaction.id} - ₦${finalPayout.toLocaleString()} sent`,
    });

    setPayoutModalOpen(false);
    setSelectedTransaction(null);
  };

  const calculateCommission = () => {
    if (!selectedTransaction) return { commissionAmount: 0, finalPayout: 0 };
    const commissionAmount = selectedTransaction.amount * (commissionRate / 100);
    const finalPayout = selectedTransaction.amount - commissionAmount;
    return { commissionAmount, finalPayout };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "Failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success":
        return "text-green-600 bg-green-50";
      case "Pending":
        return "text-yellow-600 bg-yellow-50";
      case "Failed":
        return "text-red-600 bg-red-50";
      default:
        return "";
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
        <p className="text-muted-foreground mt-1">
          Manage all payment transactions and payouts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {transactionStats.totalIncome}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All successful transactions
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {transactionStats.totalPayout}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Paid to vendors
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {transactionStats.walletBalance}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Available balance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>All Transactions</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User / Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.user}</TableCell>
                    <TableCell className="font-semibold">
                      ₦{transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{transaction.method}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.status)}
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Transaction Details</DialogTitle>
                              <DialogDescription>
                                Complete information for {transaction.id}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">
                                    Transaction ID
                                  </p>
                                  <p className="text-sm font-semibold">{transaction.id}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">
                                    User / Vendor
                                  </p>
                                  <p className="text-sm font-semibold">{transaction.user}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">
                                    Amount
                                  </p>
                                  <p className="text-sm font-semibold">
                                    ₦{transaction.amount.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">
                                    Payment Method
                                  </p>
                                  <p className="text-sm font-semibold">{transaction.method}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">
                                    Status
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {getStatusIcon(transaction.status)}
                                    <span
                                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                                        transaction.status
                                      )}`}
                                    >
                                      {transaction.status}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">
                                    Date
                                  </p>
                                  <p className="text-sm font-semibold">{transaction.date}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenPayoutModal(transaction)}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send Payout
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payout Confirmation Modal */}
      <Dialog open={payoutModalOpen} onOpenChange={setPayoutModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Payout</DialogTitle>
            <DialogDescription>
              Review the payout details and commission breakdown
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-6 py-4">
              {/* Transaction Info */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-semibold">{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vendor Name</span>
                  <span className="font-semibold">{selectedTransaction.user}</span>
                </div>
              </div>

              {/* Purchase Platform Input */}
              <div className="space-y-2">
                <Label htmlFor="purchase-platform">Purchase Platform</Label>
                <Input
                  id="purchase-platform"
                  value={purchasePlatform}
                  onChange={(e) => setPurchasePlatform(e.target.value)}
                  placeholder="e.g., Amazon, eBay, AliExpress"
                />
              </div>

              {/* Commission Rate Input */}
              <div className="space-y-2">
                <Label htmlFor="commission-rate">Commission Rate (%)</Label>
                <Input
                  id="commission-rate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                  placeholder="Enter commission rate"
                />
              </div>

              {/* Notes Input */}
              <div className="space-y-2">
                <Label htmlFor="payout-notes">Notes/Comments</Label>
                <Textarea
                  id="payout-notes"
                  value={payoutNotes}
                  onChange={(e) => setPayoutNotes(e.target.value)}
                  placeholder="Add any additional notes or comments about this payout"
                  rows={3}
                />
              </div>

              {/* Payout Breakdown */}
              <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
                <h4 className="font-semibold text-sm">Payout Breakdown</h4>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction Total</span>
                  <span className="font-medium">₦{selectedTransaction.amount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Commission ({commissionRate}%)</span>
                  <span className="font-medium text-red-600">
                    -₦{calculateCommission().commissionAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Admin Profit</span>
                  <span className="font-semibold text-green-600">
                    +₦{calculateCommission().commissionAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Final Payout</span>
                    <span className="font-bold text-lg text-primary">
                      ₦{calculateCommission().finalPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-muted-foreground">Admin Profit</span>
                  <span className="font-semibold text-green-600">
                    +₦{calculateCommission().commissionAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setPayoutModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleConfirmPayout}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Confirm & Send
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;
