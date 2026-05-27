import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Admin Users
  await prisma.adminUser.upsert({
    where: { email: "alex@kvlcentral.com" },
    update: {},
    create: {
      name: "Alex Johnson",
      email: "alex@kvlcentral.com",
      passwordHash: "admin123",
      role: "super_admin",
      status: "active",
    },
  })

  await prisma.adminUser.upsert({
    where: { email: "sara@kvlcentral.com" },
    update: {},
    create: {
      name: "Sara Ahmed",
      email: "sara@kvlcentral.com",
      passwordHash: "manager123",
      role: "manager",
      status: "active",
    },
  })

  // Sites
  await prisma.site.upsert({
    where: { url: "https://8rupiya.in" },
    update: {},
    create: {
      name: "8rupiya.in",
      url: "https://8rupiya.in",
      apiUrl: "https://8rupiya.in/api",
      apiKey: "demo-api-key-8rupiya",
      status: "connected",
      category: "E-Commerce",
      description: "Online marketplace for budget deals",
    },
  })

  // Sample Orders
  const orders = [
    { customer: "TechCorp Inc", product: "KVL ERP Suite", amount: 4999, status: "delivered" },
    { customer: "GlobalSoft", product: "KVL CRM Pro", amount: 2999, status: "shipped" },
    { customer: "DataFlow Ltd", product: "KVL Analytics", amount: 1999, status: "processing" },
    { customer: "NexGen AI", product: "KVL AI Module", amount: 3499, status: "pending" },
    { customer: "CloudBase", product: "KVL ERP Basic", amount: 1499, status: "delivered" },
  ]

  for (const order of orders) {
    await prisma.order.create({ data: order })
  }

  // Sample Leads
  const leads = [
    { name: "TechCorp Inc", email: "hello@techcorp.com", company: "TechCorp", status: "qualified", value: 250000 },
    { name: "GlobalSoft", email: "contact@globalsoft.io", company: "GlobalSoft", status: "proposal", value: 180000 },
    { name: "DataFlow Ltd", email: "team@dataflow.com", company: "DataFlow", status: "contacted", value: 95000 },
    { name: "NexGen AI", email: "hello@nexgen.ai", company: "NexGen", status: "new", value: 120000 },
    { name: "CloudBase", email: "team@cloudbase.net", company: "CloudBase", status: "closed", value: 65000 },
  ]

  for (const lead of leads) {
    await prisma.lead.create({ data: lead })
  }

  // Notifications
  await prisma.notification.createMany({
    data: [
      { title: "New site connected", message: "8rupiya.in successfully connected", type: "success", read: false },
      { title: "System update", message: "KVL Admin Panel v2.0 deployed", type: "info", read: false },
      { title: "Revenue alert", message: "Monthly target 90% achieved", type: "success", read: true },
    ],
  })

  console.log("✅ Seed completed!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
