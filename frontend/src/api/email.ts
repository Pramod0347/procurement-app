import type { EmailMessage } from "../types";

const BASE_URL = "https://procurement-app-backend.onrender.com";

export async function getAllEmails(): Promise<EmailMessage[]> {
  const res = await fetch(`${BASE_URL}/emails`);
  if (!res.ok) {
    throw new Error("Failed to load emails");
  }
  return res.json();
}
