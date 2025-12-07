export type EmailMessage = {
  id: string;
  from: string | null;
  to: string | null;
  subject: string | null;
  bodyText: string | null;
  bodyHtml?: string | null;
  status: string;
  messageId: string | null;
  receivedAt: string;
  createdAt: string;
};
