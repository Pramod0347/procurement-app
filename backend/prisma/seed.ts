import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const { Pool } = pkg;

// Use same setup as prisma.ts
const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Vendors
  await prisma.vendor.createMany({
    data: [
      { name: "Lenovo India", email: "lenovo.sales@example.com" },
      { name: "Dell Technologies", email: "dell.vendor@example.com" },
      { name: "HP Enterprise", email: "hp.vendor@example.com" },
      { name: "Asus Supplies", email: "asus.supplies@example.com" },
      { name: "Acer Distributors", email: "acer.sales@example.com" },
    ],
  });

  console.log("Vendors inserted");

  const vendorList = await prisma.vendor.findMany();

  const rfp1 = await prisma.rfp.create({
    data: {
      title: "Office Laptops Procurement",
      naturalLanguageInput:
        "Need 20 laptops with 16GB RAM. Delivery in 30 days. Net-30 payment.",
      budget: 50000,
      currency: "USD",
      minimumWarrantyMonths: 12,
      structuredSpec: {
        items: [{ name: "Laptop", qty: 20, ram: "16GB" }],
      },
    },
  });

  const rfp2 = await prisma.rfp.create({
    data: {
      title: "27-inch Monitors Purchase",
      naturalLanguageInput:
        "Required 15 monitors, 27-inch. Delivery needed in 2 weeks.",
      budget: 15000,
      currency: "USD",
      minimumWarrantyMonths: 12,
      structuredSpec: {
        items: [{ name: "Monitor", qty: 15, size: "27-inch" }],
      },
    },
  });

  const rfp3 = await prisma.rfp.create({
    data: {
      title: "Office Chairs",
      naturalLanguageInput:
        "Need ergonomic office chairs. Qty 25. Budget 20k. Delivery 1 month.",
      budget: 20000,
      currency: "USD",
      minimumWarrantyMonths: 6,
      structuredSpec: {
        items: [{ name: "Chair", qty: 25, type: "Ergonomic" }],
      },
    },
  });

  console.log("RFPs inserted");

  await prisma.proposal.createMany({
    data: [
      {
        rfpId: rfp1.id,
        vendorId: vendorList[0].id,
        totalPrice: 48000,
        currency: "USD",
        deliveryDays: 25,
        warrantyMonths: 12,
        terms: "Includes bags & laptop stands.",
      },
      {
        rfpId: rfp1.id,
        vendorId: vendorList[1].id,
        totalPrice: 52000,
        currency: "USD",
        deliveryDays: 20,
        warrantyMonths: 24,
        terms: "Extended warranty plan included.",
      },
      {
        rfpId: rfp2.id,
        vendorId: vendorList[2].id,
        totalPrice: 14000,
        currency: "USD",
        deliveryDays: 10,
        warrantyMonths: 12,
        terms: "Anti-glare screens included.",
      },
      {
        rfpId: rfp2.id,
        vendorId: vendorList[3].id,
        totalPrice: 15500,
        currency: "USD",
        deliveryDays: 14,
        warrantyMonths: 18,
        terms: null,
      },
      {
        rfpId: rfp3.id,
        vendorId: vendorList[4].id,
        totalPrice: 18000,
        currency: "USD",
        deliveryDays: 20,
        warrantyMonths: 12,
        terms: null,
      },
    ],
  });

  console.log("Proposals inserted");

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error("Error seeding DB:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
