export type EmailMessage = {
  id: string;
  from: string | null;
  to: string | null;
  subject: string | null;
  bodyText: string | null;
  bodyHtml?: string | null; // we won't show this
  status: string; // e.g. "PENDING", "PARSED"
  messageId: string | null;
  receivedAt: string; // ISO string
  createdAt: string;  // ISO string
};
