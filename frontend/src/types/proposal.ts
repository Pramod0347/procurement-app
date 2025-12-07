import type { Vendor, EmailMessage } from "../types";

export type Proposal = {
  id: string;
  rfpId: string;
  vendorId: string;

  totalPrice: number | null;
  currency: string | null;
  deliveryDays: number | null;
  warrantyMonths: number | null;

  terms: string | null;
  notes: string | null;
  source: "EMAIL" | "MANUAL";

  emailId: string | null;

  createdAt: string;
  updatedAt: string;
};

export type ProposalWithRelations = Proposal & {
  vendor: Vendor;
  email: EmailMessage | null;
};

export type ProposalComparisonResult = {
  recommendedProposalId?: string | null;
  [key: string]: any;
};
