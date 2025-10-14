import { useState } from "react";
import { withdrawalStats, withdrawals as initialWithdrawals } from "@/data/dummyData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CheckCircle, Clock, XCircle, Wallet, DollarSign, Send } from "lucide-react";
import { toast } from "sonner";

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState(initialWithdrawals);
  const [withdrawalStatsState, setWithdrawalStatsState] = useState(withdrawalStats);
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleRequestWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid withdrawal amount");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    const walletBalance = parseInt(withdrawalStatsState.walletBalance.replace(/[₦,]/g, ''));
    if (amount > walletBalance) {
      toast.error("Insufficient wallet balance");
      return;
    }

    // Create new withdrawal
    const newWithdrawal = {
      id: `WD${String(withdrawals.length + 1).padStart(3, '0')}`,
      amount,
      method: paymentMethod,
      status: "Pending",
      date: new Date().toISOString().split('T')[0],
      reference: `WD-REF-${String(withdrawals.length + 1).padStart(3, '0')}`,
    };

    setWithdrawals([newWithdrawal, ...withdrawals]);

    // Update stats
    const newWalletBalance = walletBalance - amount;
    const newTotalWithdrawn = parseInt(withdrawalStatsState.totalWithdrawn.replace(/[₦,]/g, '')) + amount;

    setWithdrawalStatsState({
      walletBalance: `₦${newWalletBalance.toLocaleString()}`,
      totalWithdrawn: `₦${newTotalWithdrawn.toLocaleString()}`,
    });

    toast.success("Withdrawal request submitted successfully!", {
      description: `Amount: ₦${amount.toLocaleString()} - Reference: ${newWithdrawal.reference}`,
    });

    setWithdrawalModalOpen(false);
    setWithdrawalAmount("");
    setPaymentMethod("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
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
      case "Completed":
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
        <h1 className="text-3xl font-bold text-foreground">Withdrawals</h1>
        <p className="text-muted-foreground mt-1">
          Manage your wallet balance and withdrawal requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wallet Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {withdrawalStatsState.walletBalance}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Available for withdrawal
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Withdrawn
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {withdrawalStatsState.totalWithdrawn}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All time withdrawals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Form */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Request New Withdrawal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Crypto">Crypto</SelectItem>
                  <SelectItem value="Paystack">Paystack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Dialog open={withdrawalModalOpen} onOpenChange={setWithdrawalModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Request Withdrawal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Withdrawal Request</DialogTitle>
                    <DialogDescription>
                      Please review your withdrawal details before submitting
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-semibold">₦{parseFloat(withdrawalAmount || "0").toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Payment Method</span>
                        <span className="font-semibold">{paymentMethod}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Processing Fee</span>
                        <span className="font-semibold">₦0.00</span>
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Withdrawal</span>
                        <span className="font-bold text-lg text-primary">
                          ₦{parseFloat(withdrawalAmount || "0").toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setWithdrawalModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleRequestWithdrawal}
                    >
                      Confirm Request
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawals Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell className="font-medium">{withdrawal.reference}</TableCell>
                    <TableCell className="font-semibold">
                      ₦{withdrawal.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{withdrawal.method}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(withdrawal.status)}
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                            withdrawal.status
                          )}`}
                        >
                          {withdrawal.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{withdrawal.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Withdrawals;