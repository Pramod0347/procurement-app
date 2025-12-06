import type {
  ProposalWithRelations,
  ProposalComparisonResult,
} from "../types";

const BASE_URL = "https://procurement-app-backend.onrender.com";

// GET /rfps/:rfpId/proposals
export async function getProposalsForRfp(
  rfpId: string
): Promise<ProposalWithRelations[]> {
  const res = await fetch(`${BASE_URL}/rfps/${rfpId}/proposals`);

  if (!res.ok) {
    throw new Error("Failed to load proposals for this RFP");
  }

  return res.json();
}

// GET /rfps/:rfpId/compare
export async function getProposalComparison(
  rfpId: string
): Promise<ProposalComparisonResult> {
  const res = await fetch(`${BASE_URL}/rfps/${rfpId}/compare`);

  if (!res.ok) {
    throw new Error("Failed to load comparison for this RFP");
  }

  return res.json();
}
