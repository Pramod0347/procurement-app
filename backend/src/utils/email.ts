export function extractEmailAddress(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const match = raw.match(/<([^>]+)>/);
  const email = match ? match[1] : raw;
  return email.trim().toLowerCase();
}

export function extractRfpSelectorFromSubject(
  subject: string | null | undefined
): { rfpId?: string; keyword?: string } {
  if (!subject) return {};

  const cleanedSubject = subject.replace(/^(re|fwd?):\s*/i, "").trim();

  const idMatch = subject.match(/\bRFPID\s*[:\-]\s*([a-zA-Z0-9]+)/i);
  if (idMatch && idMatch[1]) {
    return { rfpId: idMatch[1] };
  }

  const keywordMatch = subject.match(/\bRFP\s*[:\-]\s*(.+)$/i);
  if (keywordMatch && keywordMatch[1]) {
    return { keyword: keywordMatch[1].trim() };
  }

  // Fallback: use a cleaned subject as a loose keyword (e.g., "Proposal for Procurement of 20 Business Laptops")
  const stripped = cleanedSubject
    .replace(/^(proposal|quote|bid)\s+for\s+/i, "")
    .replace(/^(proposal|quote|bid)\s*[:\-]\s*/i, "")
    .trim();

  if (stripped.length >= 3) {
    return { keyword: stripped };
  }

  return {};
}
