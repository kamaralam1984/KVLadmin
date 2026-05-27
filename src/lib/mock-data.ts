import type { User, Lead, Product, Order, Notification, ChartDataPoint } from "@/types";

export const revenueData: ChartDataPoint[] = [
  { name: "Jan", value: 42000, secondary: 28000 },
  { name: "Feb", value: 58000, secondary: 35000 },
  { name: "Mar", value: 51000, secondary: 42000 },
  { name: "Apr", value: 73000, secondary: 55000 },
  { name: "May", value: 89000, secondary: 61000 },
  { name: "Jun", value: 95000, secondary: 72000 },
  { name: "Jul", value: 112000, secondary: 85000 },
  { name: "Aug", value: 98000, secondary: 78000 },
  { name: "Sep", value: 125000, secondary: 92000 },
  { name: "Oct", value: 138000, secondary: 105000 },
  { name: "Nov", value: 152000, secondary: 118000 },
  { name: "Dec", value: 178000, secondary: 135000 },
];

export const userGrowthData: ChartDataPoint[] = [
  { name: "Jan", value: 1200 },
  { name: "Feb", value: 1900 },
  { name: "Mar", value: 2400 },
  { name: "Apr", value: 3100 },
  { name: "May", value: 4200 },
  { name: "Jun", value: 5800 },
  { name: "Jul", value: 7200 },
  { name: "Aug", value: 8900 },
  { name: "Sep", value: 10500 },
  { name: "Oct", value: 12800 },
  { name: "Nov", value: 15200 },
  { name: "Dec", value: 18500 },
];

export const salesByCategory: ChartDataPoint[] = [
  { name: "SaaS", value: 45 },
  { name: "ERP", value: 25 },
  { name: "CRM", value: 20 },
  { name: "Other", value: 10 },
];

export const mockUsers: User[] = [
  { id: "1", name: "Alex Johnson", email: "alex@kvl.com", role: "super_admin", status: "active", createdAt: "2024-01-15", lastLogin: "2026-05-25" },
  { id: "2", name: "Sarah Chen", email: "sarah@kvl.com", role: "admin", status: "active", createdAt: "2024-02-20", lastLogin: "2026-05-24" },
  { id: "3", name: "Marcus Lee", email: "marcus@kvl.com", role: "manager", status: "active", createdAt: "2024-03-10", lastLogin: "2026-05-23" },
  { id: "4", name: "Emily Davis", email: "emily@kvl.com", role: "staff", status: "active", createdAt: "2024-04-05", lastLogin: "2026-05-22" },
  { id: "5", name: "Ryan Park", email: "ryan@kvl.com", role: "staff", status: "inactive", createdAt: "2024-05-12", lastLogin: "2026-04-15" },
  { id: "6", name: "Nina Patel", email: "nina@kvl.com", role: "manager", status: "active", createdAt: "2024-06-18", lastLogin: "2026-05-25" },
  { id: "7", name: "Chris Walker", email: "chris@kvl.com", role: "staff", status: "suspended", createdAt: "2024-07-22", lastLogin: "2026-03-10" },
  { id: "8", name: "Zoe Martinez", email: "zoe@kvl.com", role: "admin", status: "active", createdAt: "2024-08-30", lastLogin: "2026-05-26" },
];

export const mockLeads: Lead[] = [
  { id: "1", name: "TechCorp Inc", email: "contact@techcorp.com", company: "TechCorp", status: "qualified", value: 45000, createdAt: "2026-05-01" },
  { id: "2", name: "GlobalSoft", email: "sales@globalsoft.io", company: "GlobalSoft", status: "proposal", value: 82000, createdAt: "2026-05-05" },
  { id: "3", name: "DataFlow Ltd", email: "info@dataflow.co", company: "DataFlow", status: "contacted", value: 28000, createdAt: "2026-05-10" },
  { id: "4", name: "NexGen AI", email: "hello@nexgen.ai", company: "NexGen", status: "new", value: 120000, createdAt: "2026-05-15" },
  { id: "5", name: "CloudBase", email: "team@cloudbase.net", company: "CloudBase", status: "closed", value: 65000, createdAt: "2026-04-20" },
];

export const mockProducts: Product[] = [
  { id: "1", name: "KVL ERP Suite", sku: "ERP-001", price: 4999, stock: 999, category: "ERP", status: "active" },
  { id: "2", name: "KVL CRM Pro", sku: "CRM-001", price: 2999, stock: 999, category: "CRM", status: "active" },
  { id: "3", name: "KVL Analytics", sku: "ANL-001", price: 1999, stock: 999, category: "Analytics", status: "active" },
  { id: "4", name: "KVL AI Module", sku: "AI-001", price: 3499, stock: 999, category: "AI", status: "active" },
  { id: "5", name: "KVL HR Suite", sku: "HR-001", price: 1499, stock: 999, category: "HR", status: "inactive" },
];

export const mockOrders: Order[] = [
  { id: "ORD-001", customer: "TechCorp Inc", product: "KVL ERP Suite", amount: 4999, status: "delivered", createdAt: "2026-05-20" },
  { id: "ORD-002", customer: "GlobalSoft", product: "KVL CRM Pro", amount: 2999, status: "shipped", createdAt: "2026-05-22" },
  { id: "ORD-003", customer: "DataFlow Ltd", product: "KVL Analytics", amount: 1999, status: "processing", createdAt: "2026-05-24" },
  { id: "ORD-004", customer: "NexGen AI", product: "KVL AI Module", amount: 3499, status: "pending", createdAt: "2026-05-25" },
  { id: "ORD-005", customer: "CloudBase", product: "KVL ERP Suite", amount: 4999, status: "delivered", createdAt: "2026-05-18" },
];

export const mockNotifications: Notification[] = [
  { id: "1", title: "New User Signup", message: "Alex Johnson joined the platform", type: "success", read: false, createdAt: "2026-05-26T10:30:00" },
  { id: "2", title: "Revenue Milestone", message: "Monthly revenue exceeded $150K", type: "success", read: false, createdAt: "2026-05-26T09:15:00" },
  { id: "3", title: "System Alert", message: "High CPU usage detected on server-02", type: "warning", read: false, createdAt: "2026-05-26T08:00:00" },
  { id: "4", title: "New Order", message: "Order ORD-004 received from NexGen AI", type: "info", read: true, createdAt: "2026-05-25T16:45:00" },
  { id: "5", title: "Failed Login", message: "Multiple failed login attempts detected", type: "error", read: true, createdAt: "2026-05-25T14:20:00" },
];
