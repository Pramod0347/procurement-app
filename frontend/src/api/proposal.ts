import type {
  ProposalWithRelations,
  ProposalComparisonResult,
} from "../types";
import { API_BASE_URL } from "../config";
import { fetchWithSlowOverlay } from "../lib/slowOverlay";

export async function getProposalsForRfp(
  rfpId: string
): Promise<ProposalWithRelations[]> {
  const res = await fetchWithSlowOverlay(
    `${API_BASE_URL}/rfps/${rfpId}/proposals`
  );

  if (!res.ok) {
    throw new Error("Failed to load proposals for this RFP");
  }

  return res.json();
}

export async function getProposalComparison(
  rfpId: string
): Promise<ProposalComparisonResult> {
  const res = await fetchWithSlowOverlay(
    `${API_BASE_URL}/rfps/${rfpId}/compare`
  );

  if (!res.ok) {
    throw new Error("Failed to load comparison for this RFP");
  }

  return res.json();
}
