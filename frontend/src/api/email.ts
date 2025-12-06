import type { EmailMessage } from "../types";
import { API_BASE_URL } from "../config";

export async function getAllEmails(): Promise<EmailMessage[]> {
  const res = await fetch(`${API_BASE_URL}/emails`);
  if (!res.ok) {
    throw new Error("Failed to load emails");
  }
  return res.json();
}
