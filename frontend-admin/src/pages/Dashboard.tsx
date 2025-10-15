import { useEffect, useState } from "react";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/dashboard/StatCard";
import { dashboardStats, salesData, recentOrders } from "@/data/dummyData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useApi } from "@/hooks/useApi";

const Dashboard = () => {
  const [stats, setStats] = useState(dashboardStats);
  const [orders, setOrders] = useState(recentOrders);
  const [salesChartData, setSalesChartData] = useState(salesData);

  const { execute: fetchStats, loading: statsLoading } = useApi(async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.warn('Failed to fetch real stats, using dummy data:', error);
    }
    return null;
  });

  const { execute: fetchOrders, loading: ordersLoading } = useApi(async () => {
    try {
      const response = await fetch('/api/admin/orders?limit=5', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        return data.orders || [];
      }
    } catch (error) {
      console.warn('Failed to fetch real orders, using dummy data:', error);
    }
    return null;
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      const realStats = await fetchStats();
      if (realStats) {
        setStats({
          totalOrders: realStats.totalOrders || dashboardStats.totalOrders,
          totalRevenue: `$${realStats.totalRevenue || dashboardStats.totalRevenue.replace('$', '')}`,
          activeUsers: realStats.activeUsers || dashboardStats.activeUsers,
          productsInStock: realStats.productsInStock || dashboardStats.productsInStock,
        });
      }

      const realOrders = await fetchOrders();
      if (realOrders && realOrders.length > 0) {
        setOrders(realOrders.map((order: any) => ({
          id: order.id || order._id,
          customer: order.customerName || order.user?.name || 'Unknown',
          total: `$${order.total || 0}`,
          status: order.status || 'Pending',
          date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : order.date,
        })));
      }
    };

    loadDashboardData();
  }, [fetchStats, fetchOrders]);
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          trend={{ value: "12% from last month", isPositive: true }}
          loading={statsLoading}
        />
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          icon={DollarSign}
          trend={{ value: "8% from last month", isPositive: true }}
          loading={statsLoading}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={Users}
          trend={{ value: "3% from last month", isPositive: false }}
          loading={statsLoading}
        />
        <StatCard
          title="Products in Stock"
          value={stats.productsInStock}
          icon={Package}
          loading={statsLoading}
        />
      </div>

      {/* Charts and Recent Orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--accent))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--accent))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ordersLoading ? (
                <div className="text-center py-4">Loading orders...</div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3 transition-smooth hover:shadow-soft"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{order.total}</p>
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
