import { useState, useEffect } from "react";
import { Search, Eye, Edit, Truck, Package, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { orders as initialOrders } from "@/data/dummyData";
import { toast } from "sonner";

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  // Load orders from backend
  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        // Transform backend orders to frontend format
        const transformedOrders = data.orders.map((order: any) => ({
          id: order.orderNumber,
          customer: `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'Unknown',
          total: `$${(order.totalAmount?.amount || 0).toFixed(2)}`,
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
          date: new Date(order.createdAt).toLocaleDateString(),
          items: order.items || [],
          shippingAddress: order.shippingAddress,
          payment: order.payment,
          trackingNumber: order.trackingNumber,
          estimatedDeliveryDate: order.estimatedDeliveryDate,
          _id: order._id
        }));
        setOrders(transformedOrders);
      } else {
        // Fallback to dummy data
        setOrders(initialOrders);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
      // Fallback to dummy data
      setOrders(initialOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingNumber(order.trackingNumber || "");
    setCancelReason("");
    setOrderModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: newStatus.toLowerCase(),
          trackingNumber: trackingNumber || undefined,
          estimatedDeliveryDate: newStatus.toLowerCase() === 'shipped' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
          cancelReason: newStatus.toLowerCase() === 'cancelled' ? cancelReason : undefined
        })
      });

      if (response.ok) {
        // Update local state
        setOrders(prev => prev.map(order =>
          order.id === selectedOrder.id
            ? {
                ...order,
                status: newStatus,
                trackingNumber: trackingNumber || order.trackingNumber,
                updatedAt: new Date().toISOString()
              }
            : order
        ));

        toast.success(`Order ${selectedOrder.id} status updated to ${newStatus}`);
        setOrderModalOpen(false);
        setSelectedOrder(null);
        setTrackingNumber("");
        setCancelReason("");
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-500" />;
      case "confirmed":
      case "processing":
        return <Package className="h-4 w-4 text-orange-500" />;
      case "pending":
        return <Package className="h-4 w-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      case "processing":
        return "bg-orange-100 text-orange-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-1">Track and manage customer orders</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadOrders}
                disabled={loading}
                className="transition-smooth"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {["All", "Pending", "Shipped", "Completed", "Cancelled"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="transition-smooth"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Loading orders...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/30 transition-smooth">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="font-semibold">{order.total}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(order)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Update Status
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Management Modal */}
      <Dialog open={orderModalOpen} onOpenChange={setOrderModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Management</DialogTitle>
            <DialogDescription>
              Update order status and track delivery progress
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Order Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Order ID</Label>
                    <p className="text-sm font-semibold">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Customer</Label>
                    <p className="text-sm font-semibold">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Country</Label>
                    <p className="text-sm font-semibold">{selectedOrder.shippingAddress?.country || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Payment Method</Label>
                    <p className="text-sm font-semibold">{selectedOrder.payment?.method || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Total Amount</Label>
                    <p className="text-sm font-semibold">{selectedOrder.total}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Order Date</Label>
                    <p className="text-sm font-semibold">{selectedOrder.date}</p>
                  </div>
                </div>
              </div>

              {/* Tracking Information */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Delivery Tracking</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <Package className="h-5 w-5 text-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Order Placed</p>
                      <p className="text-xs text-muted-foreground">{selectedOrder.date}</p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>

                  {["Pending", "Shipped", "Delivered"].includes(selectedOrder.status) && (
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <Truck className="h-5 w-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Shipped</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedOrder.status === "Shipped" || selectedOrder.status === "Delivered"
                            ? selectedOrder.updatedAt || "In transit"
                            : "Pending"}
                        </p>
                      </div>
                      {(selectedOrder.status === "Shipped" || selectedOrder.status === "Delivered") && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  )}

                  {selectedOrder.status === "Delivered" && (
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Delivered</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedOrder.updatedAt || selectedOrder.date}
                        </p>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Status Update */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Update Order Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tracking Number for Shipped orders */}
                {newStatus === "Shipped" && (
                  <div className="space-y-2">
                    <Label htmlFor="tracking">Tracking Number</Label>
                    <Input
                      id="tracking"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                    />
                  </div>
                )}

                {/* Cancel Reason for Cancelled orders */}
                {newStatus === "Cancelled" && (
                  <div className="space-y-2">
                    <Label htmlFor="cancelReason">Cancellation Reason</Label>
                    <Textarea
                      id="cancelReason"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Enter reason for cancellation"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setOrderModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleUpdateStatus}
                  disabled={newStatus === selectedOrder.status}
                >
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
