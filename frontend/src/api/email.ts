import type { EmailMessage } from "../types";
import { API_BASE_URL } from "../config";
import { fetchWithSlowOverlay } from "../lib/slowOverlay";

export async function getAllEmails(): Promise<EmailMessage[]> {
  const res = await fetchWithSlowOverlay(`${API_BASE_URL}/emails`);
  if (!res.ok) {
    throw new Error("Failed to load emails");
  }
  return res.json();
}
