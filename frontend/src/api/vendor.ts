import type { Vendor } from "../types";

const BASE_URL = "http://localhost:4000";

export async function getAllVendors(): Promise<Vendor[]> {
  try {
    const res = await fetch(`${BASE_URL}/vendors`);
    if (!res.ok) throw new Error("Failed to load vendors");
    return await res.json();
  } catch (error) {
    console.error("getAllVendors error", error);
    throw error;
  }
}

export async function createVendor(data: {
  name: string;
  email: string;
  contactPerson?: string;
  notes?: string;
}): Promise<Vendor> {
  try {
    const res = await fetch(`${BASE_URL}/vendors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create vendor");

    return await res.json();
  } catch (error) {
    console.error("createVendor error", error);
    throw error;
  }
}
