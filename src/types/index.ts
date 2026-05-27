export type Role = "super_admin" | "admin" | "manager" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "inactive" | "suspended";
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

export interface KPICard {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  secondary?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "closed";
  value: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: "active" | "inactive";
}

export interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export type SiteStatus = "connected" | "disconnected" | "error" | "pending";

export interface Site {
  id: string;
  name: string;
  url: string;
  apiUrl: string;
  apiKey: string;
  status: SiteStatus;
  lastChecked?: string;
  favicon?: string;
  category?: string;
  description?: string;
  createdAt: string;
}

export interface SiteProxyRequest {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}
