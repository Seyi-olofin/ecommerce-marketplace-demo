export const dashboardStats = {
  totalOrders: 1234,
  totalRevenue: "$48,562",
  activeUsers: 8549,
  productsInStock: 367,
};

export const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4500 },
  { month: "May", sales: 6000 },
  { month: "Jun", sales: 5500 },
];

export const recentOrders = [
  { id: "#ORD-001", customer: "John Doe", total: "$156.00", status: "Completed", date: "2025-10-10" },
  { id: "#ORD-002", customer: "Jane Smith", total: "$89.50", status: "Pending", date: "2025-10-09" },
  { id: "#ORD-003", customer: "Bob Johnson", total: "$234.99", status: "Shipped", date: "2025-10-08" },
  { id: "#ORD-004", customer: "Alice Williams", total: "$67.25", status: "Completed", date: "2025-10-07" },
  { id: "#ORD-005", customer: "Charlie Brown", total: "$445.00", status: "Pending", date: "2025-10-06" },
];

export const products = [
  { id: 1, name: "Wireless Mouse", category: "Electronics", price: "$29.99", stock: 145, status: "In Stock" },
  { id: 2, name: "USB-C Cable", category: "Accessories", price: "$12.99", stock: 289, status: "In Stock" },
  { id: 3, name: "Bluetooth Headphones", category: "Electronics", price: "$89.99", stock: 67, status: "Low Stock" },
  { id: 4, name: "Phone Case", category: "Accessories", price: "$19.99", stock: 0, status: "Out of Stock" },
  { id: 5, name: "Laptop Stand", category: "Office", price: "$45.99", stock: 124, status: "In Stock" },
  { id: 6, name: "Mechanical Keyboard", category: "Electronics", price: "$129.99", stock: 45, status: "Low Stock" },
  { id: 7, name: "Monitor 27\"", category: "Electronics", price: "$349.99", stock: 23, status: "Low Stock" },
  { id: 8, name: "Desk Lamp", category: "Office", price: "$34.99", stock: 178, status: "In Stock" },
];

export const orders = [
  { id: "#ORD-001", customer: "John Doe", total: "$156.00", status: "Completed", date: "2025-10-10" },
  { id: "#ORD-002", customer: "Jane Smith", total: "$89.50", status: "Pending", date: "2025-10-09" },
  { id: "#ORD-003", customer: "Bob Johnson", total: "$234.99", status: "Shipped", date: "2025-10-08" },
  { id: "#ORD-004", customer: "Alice Williams", total: "$67.25", status: "Completed", date: "2025-10-07" },
  { id: "#ORD-005", customer: "Charlie Brown", total: "$445.00", status: "Pending", date: "2025-10-06" },
  { id: "#ORD-006", customer: "Diana Prince", total: "$123.75", status: "Shipped", date: "2025-10-05" },
  { id: "#ORD-007", customer: "Ethan Hunt", total: "$298.50", status: "Completed", date: "2025-10-04" },
  { id: "#ORD-008", customer: "Fiona Green", total: "$56.00", status: "Pending", date: "2025-10-03" },
];

export const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Customer", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Customer", status: "Active" },
  { id: 4, name: "Alice Williams", email: "alice@example.com", role: "Customer", status: "Inactive" },
  { id: 5, name: "Charlie Brown", email: "charlie@example.com", role: "Manager", status: "Active" },
  { id: 6, name: "Diana Prince", email: "diana@example.com", role: "Customer", status: "Active" },
  { id: 7, name: "Ethan Hunt", email: "ethan@example.com", role: "Customer", status: "Active" },
  { id: 8, name: "Fiona Green", email: "fiona@example.com", role: "Customer", status: "Inactive" },
];

export const transactionStats = {
  totalIncome: "₦120,000",
  totalPayout: "₦45,000",
  walletBalance: "₦75,000",
  profit: "₦75,000",
};

export const transactions = [
  { id: "TXN001", user: "John Doe", amount: 50000, method: "Crypto", status: "Success", date: "2025-10-10" },
  { id: "TXN002", user: "Temmy Glow", amount: 25000, method: "Paystack", status: "Pending", date: "2025-10-11" },
  { id: "TXN003", user: "Jane Smith", amount: 75000, method: "Bank Transfer", status: "Success", date: "2025-10-09" },
  { id: "TXN004", user: "Bob Johnson", amount: 15000, method: "Crypto", status: "Failed", date: "2025-10-08" },
  { id: "TXN005", user: "Alice Williams", amount: 45000, method: "Paystack", status: "Success", date: "2025-10-07" },
  { id: "TXN006", user: "Charlie Brown", amount: 30000, method: "Bank Transfer", status: "Pending", date: "2025-10-06" },
  { id: "TXN007", user: "Diana Prince", amount: 60000, method: "Crypto", status: "Success", date: "2025-10-05" },
  { id: "TXN008", user: "Ethan Hunt", amount: 20000, method: "Paystack", status: "Failed", date: "2025-10-04" },
];

export const withdrawalStats = {
  walletBalance: "₦75,000",
  totalWithdrawn: "₦25,000",
};

export const withdrawals = [
  { id: "WD001", amount: 10000, method: "Bank Transfer", status: "Completed", date: "2025-10-10", reference: "WD-REF-001" },
  { id: "WD002", amount: 15000, method: "Crypto", status: "Pending", date: "2025-10-09", reference: "WD-REF-002" },
  { id: "WD003", amount: 5000, method: "Paystack", status: "Completed", date: "2025-10-08", reference: "WD-REF-003" },
  { id: "WD004", amount: 20000, method: "Bank Transfer", status: "Failed", date: "2025-10-07", reference: "WD-REF-004" },
  { id: "WD005", amount: 8000, method: "Crypto", status: "Completed", date: "2025-10-06", reference: "WD-REF-005" },
];
