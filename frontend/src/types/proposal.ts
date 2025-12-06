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

// This matches what your backend returns from /rfps/:rfpId/proposals
// (include: { vendor: true, email: true })
export type ProposalWithRelations = Proposal & {
  vendor: Vendor;
  email: EmailMessage | null;
};

// Comparison result – we keep it generic + “recommendedProposalId”
export type ProposalComparisonResult = {
  recommendedProposalId?: string | null;
  // anything else your backend returns – scores, breakdown etc
  [key: string]: any;
};
