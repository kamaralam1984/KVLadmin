import type { User, Order, Product, Lead, Site } from "@/types"
import type { Notification } from "@/types"

interface OtpSession {
  email: string
  otp: string
  expiresAt: number
}

interface DbStore {
  users: (User & { passwordHash: string })[]
  orders: Order[]
  products: Product[]
  notifications: Notification[]
  leads: Lead[]
  sites: Site[]
  otpSessions: Map<string, OtpSession>
}

declare global {
  // eslint-disable-next-line no-var
  var __kvlDb: DbStore | undefined
}

function initDb(): DbStore {
  return {
    users: [
      {
        id: "1",
        name: "Alex Johnson",
        email: "alex@kvl.com",
        role: "super_admin",
        status: "active",
        createdAt: "2024-01-15",
        lastLogin: "2026-05-25",
        passwordHash: "password123",
      },
      {
        id: "2",
        name: "Sarah Chen",
        email: "sarah@kvl.com",
        role: "admin",
        status: "active",
        createdAt: "2024-02-20",
        lastLogin: "2026-05-24",
        passwordHash: "admin456",
      },
      {
        id: "3",
        name: "James Kumar",
        email: "james@kvl.com",
        role: "manager",
        status: "active",
        createdAt: "2024-03-10",
        lastLogin: "2026-05-23",
        passwordHash: "manager789",
      },
    ],
    orders: [
      { id: "ORD-001", customer: "TechCorp Inc", product: "KVL ERP Suite", amount: 4999, status: "delivered", createdAt: "2026-05-20" },
      { id: "ORD-002", customer: "GlobalSoft", product: "KVL CRM Pro", amount: 2999, status: "shipped", createdAt: "2026-05-22" },
      { id: "ORD-003", customer: "DataFlow Ltd", product: "KVL Analytics", amount: 1999, status: "processing", createdAt: "2026-05-24" },
      { id: "ORD-004", customer: "NexGen AI", product: "KVL AI Module", amount: 3499, status: "pending", createdAt: "2026-05-25" },
      { id: "ORD-005", customer: "CloudBase", product: "KVL ERP Suite", amount: 4999, status: "delivered", createdAt: "2026-05-18" },
    ],
    products: [
      { id: "1", name: "KVL ERP Suite", sku: "ERP-001", price: 4999, stock: 999, category: "ERP", status: "active" },
      { id: "2", name: "KVL CRM Pro", sku: "CRM-001", price: 2999, stock: 999, category: "CRM", status: "active" },
      { id: "3", name: "KVL Analytics", sku: "ANL-001", price: 1999, stock: 999, category: "Analytics", status: "active" },
      { id: "4", name: "KVL AI Module", sku: "AI-001", price: 3499, stock: 150, category: "AI", status: "active" },
    ],
    notifications: [
      { id: "1", title: "New User Signup", message: "Alex Johnson joined the platform", type: "success", read: false, createdAt: "2026-05-26T10:30:00" },
      { id: "2", title: "Revenue Milestone", message: "Monthly revenue exceeded $150K", type: "success", read: false, createdAt: "2026-05-26T09:15:00" },
      { id: "3", title: "System Alert", message: "High CPU usage detected on server-02", type: "warning", read: false, createdAt: "2026-05-26T08:00:00" },
      { id: "4", title: "New Order", message: "Order ORD-004 received from NexGen AI", type: "info", read: true, createdAt: "2026-05-25T16:45:00" },
      { id: "5", title: "Failed Login", message: "Multiple failed login attempts detected", type: "error", read: true, createdAt: "2026-05-25T14:20:00" },
    ],
    leads: [
      { id: "1", name: "TechCorp Inc", email: "hello@techcorp.com", company: "TechCorp", status: "qualified", value: 250000, createdAt: "2026-04-10" },
      { id: "2", name: "GlobalSoft", email: "contact@globalsoft.io", company: "GlobalSoft", status: "proposal", value: 180000, createdAt: "2026-04-28" },
      { id: "3", name: "DataFlow Ltd", email: "team@dataflow.com", company: "DataFlow", status: "contacted", value: 95000, createdAt: "2026-05-05" },
      { id: "4", name: "NexGen AI", email: "hello@nexgen.ai", company: "NexGen", status: "new", value: 120000, createdAt: "2026-05-15" },
      { id: "5", name: "CloudBase", email: "team@cloudbase.net", company: "CloudBase", status: "closed", value: 65000, createdAt: "2026-04-20" },
    ],
    sites: [
      {
        id: "site-1",
        name: "8rupiya.in",
        url: "https://8rupiya.in",
        apiUrl: "https://8rupiya.in/api",
        apiKey: "demo-api-key-8rupiya",
        status: "pending",
        category: "E-Commerce",
        description: "Online marketplace for budget deals",
        createdAt: "2026-05-26",
      },
      {
        id: "site-2",
        name: "Demo Store",
        url: "https://demo-store.kvl.com",
        apiUrl: "https://demo-store.kvl.com/api",
        apiKey: "demo-key-xyz",
        status: "connected",
        category: "E-Commerce",
        description: "KVL internal demo store",
        createdAt: "2026-05-20",
      },
    ],
    otpSessions: new Map(),
  }
}

export const db: DbStore = global.__kvlDb ?? (global.__kvlDb = initDb())
