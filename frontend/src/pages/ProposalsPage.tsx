import React, { useEffect, useState } from "react";
import { getAllRfps } from "../api/rfp";
import { getProposalComparison } from "../api/proposal";
import type { Rfp, Vendor } from "../types";

type CriteriaWeights = {
  price: number;
  delivery: number;
  warranty: number;
};

type ProposalScores = {
  priceScore: number;
  deliveryScore: number;
  warrantyScore: number;
  totalScore: number;
  scoreOutOf10: number;
};

type ComparisonProposal = {
  id: string;
  rfpId: string;
  vendorId: string;
  totalPrice: number | null;
  currency: string | null;
  deliveryDays: number | null;
  warrantyMonths: number | null;
  terms: string | null;
  notes: string | null;
  createdAt: string;
  source: "EMAIL" | "MANUAL";
  emailId: string | null;
  vendor: Vendor;
  scores: ProposalScores;
};

type RfpComparison = {
  rfpId: string;
  rfpTitle: string;
  currency: string | null;
  criteriaWeights: CriteriaWeights;
  proposals: ComparisonProposal[];
  bestProposalId: string | null;
};

export function ProposalsPage() {
  const [rfps, setRfps] = useState<Rfp[]>([]);
  const [selectedRfpId, setSelectedRfpId] = useState<string>("");

  const [comparison, setComparison] = useState<RfpComparison | null>(null);
  const [loadingRfps, setLoadingRfps] = useState(true);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [expandedProposalId, setExpandedProposalId] = useState<string | null>(
    null
  );
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    async function loadRfps() {
      try {
        setLoadingRfps(true);
        setError(null);
        const data = await getAllRfps();
        setRfps(data);
      } catch (err: any) {
        console.error("Failed to load RFPs", err);
        setError(err.message ?? "Failed to load RFPs");
      } finally {
        setLoadingRfps(false);
      }
    }

    loadRfps();
  }, []);

  useEffect(() => {
    if (!selectedRfpId) {
      setComparison(null);
      setExpandedProposalId(null);
      return;
    }

    async function loadCompare() {
      try {
        setLoadingCompare(true);
        setError(null);
        setExpandedProposalId(null);

        const data = (await getProposalComparison(
          selectedRfpId
        )) as RfpComparison;

        setComparison(data);
      } catch (err: any) {
        console.error("Failed to load comparison", err);
        setError(err.message ?? "Failed to load comparison");
        setComparison(null);
      } finally {
        setLoadingCompare(false);
      }
    }

    loadCompare();
  }, [selectedRfpId]);

  function toggleExpanded(id: string) {
    setExpandedProposalId((current) => (current === id ? null : id));
  }

  const recommendedProposal =
    comparison?.proposals.find((p) => p.id === comparison.bestProposalId) ??
    getFallbackRecommended(comparison);

  const rankById: Record<string, number> = {};
  if (comparison?.proposals?.length) {
    const sorted = [...comparison.proposals].sort(
      (a, b) => (b.scores.totalScore ?? 0) - (a.scores.totalScore ?? 0)
    );
    sorted.forEach((p, index) => {
      rankById[p.id] = index + 1;
    });
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8 text-center">
          <p className="text-xs font-medium uppercase text-indigo-600">
            Proposals
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Compare vendor proposals
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Pick an RFP to see its proposals ranked by price, delivery, and
            warranty.
          </p>
        </header>

        <section className="mb-8 flex justify-center">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <div className="text-center">
              <p className="text-xs font-medium uppercase text-slate-500">
                Choose RFP
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Start by selecting the RFP you want to compare proposals for.
              </p>
            </div>

            <div className="mt-4 flex justify-center">
              <select
                className="w-full max-w-sm rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                value={selectedRfpId}
                onChange={(e) => setSelectedRfpId(e.target.value)}
                disabled={loadingRfps || rfps.length === 0}
              >
                <option value="">Select an RFP…</option>
                {rfps.map((rfp) => (
                  <option key={rfp.id} value={rfp.id}>
                    {rfp.title}
                  </option>
                ))}
              </select>
            </div>

            {loadingRfps && (
              <p className="mt-2 text-center text-xs text-slate-500">
                Loading RFPs…
              </p>
            )}
          </div>
        </section>

        {error && (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        )}

        {!selectedRfpId && !loadingCompare && (
          <p className="text-center text-sm text-slate-600">
            Select an RFP above to see proposal comparison.
          </p>
        )}

        {selectedRfpId && loadingCompare && (
          <p className="text-center text-sm text-slate-600">
            Calculating comparison for this RFP…
          </p>
        )}

        {selectedRfpId &&
          !loadingCompare &&
          !error &&
          comparison &&
          comparison.proposals.length === 0 && (
            <p className="text-center text-sm text-slate-600">
              No proposals found yet for this RFP.
            </p>
          )}

        {selectedRfpId &&
          !loadingCompare &&
          !error &&
          comparison &&
          comparison.proposals.length > 0 && (
            <>
              <section className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Comparison setup
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
                  <div>
                    <p className="text-[11px] uppercase text-slate-500">
                      RFP
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {comparison.rfpTitle}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <CriteriaChip
                      label="Price weight"
                      value={comparison.criteriaWeights.price}
                    />
                    <CriteriaChip
                      label="Delivery weight"
                      value={comparison.criteriaWeights.delivery}
                    />
                    <CriteriaChip
                      label="Warranty weight"
                      value={comparison.criteriaWeights.warranty}
                    />
                    {comparison.currency && (
                      <div>
                        <p className="text-[11px] uppercase text-slate-500">
                          Currency
                        </p>
                        <p className="text-sm text-slate-900">
                          {comparison.currency}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {recommendedProposal && (
                <section className="mb-6">
                  <RecommendedProposalCard
                    proposal={recommendedProposal}
                    rank={rankById[recommendedProposal.id]}
                  />
                </section>
              )}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Rank
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Vendor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Total Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Delivery (days)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Warranty (months)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Score (0–10)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Source
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {comparison.proposals.map((p) => {
                      const isBest = p.id === comparison.bestProposalId;
                      const rank = rankById[p.id];
                      return (
                        <React.Fragment key={p.id}>
                          <tr
                            className={
                              isBest ? "bg-emerald-50/40" : "hover:bg-slate-50"
                            }
                          >
                            <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                              {rank ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-slate-900">
                              {p.vendor.name}
                              {isBest && (
                                <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                                  Recommended
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {p.totalPrice != null
                                ? `${p.totalPrice} ${p.currency ?? ""}`
                                : "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {p.deliveryDays ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {p.warrantyMonths ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {p.scores?.scoreOutOf10 != null
                                ? `${p.scores.scoreOutOf10.toFixed(2)} / 10`
                                : "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {p.source}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => toggleExpanded(p.id)}
                                className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                              >
                                {expandedProposalId === p.id
                                  ? "Hide"
                                  : "Details"}
                              </button>
                            </td>
                          </tr>

                          {expandedProposalId === p.id && (
                            <tr className="bg-slate-50/60">
                              <td className="px-4 pb-4 pt-1" colSpan={8}>
                                <ProposalInlineDetails proposal={p} />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </section>

              <section className="mt-4">
                <button
                  onClick={() => setShowRaw((prev) => !prev)}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  {showRaw ? "Hide raw comparison data" : "Show raw comparison data"}
                </button>
                {showRaw && (
                  <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-slate-900 p-3 text-[11px] text-slate-50">
{JSON.stringify(comparison, null, 2)}
                  </pre>
                )}
              </section>
            </>
          )}
      </div>
    </div>
  );
}

function getFallbackRecommended(
  comparison: RfpComparison | null
): ComparisonProposal | undefined {
  if (!comparison || !comparison.proposals.length) return undefined;
  return comparison.proposals.reduce((best, current) =>
    current.scores.totalScore > best.scores.totalScore ? current : best
  );
}

function CriteriaChip({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-[11px] uppercase text-slate-500">
        {label}
      </p>
      <p className="text-sm text-slate-900">
        {(value * 100).toFixed(0)}%
      </p>
    </div>
  );
}

function RecommendedProposalCard({
  proposal,
  rank,
}: {
  proposal: ComparisonProposal;
  rank?: number;
}) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
        Recommended proposal
      </p>
      <div className="mt-1 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {proposal.vendor.name}
          </p>
          <p className="text-xs text-slate-700">
            {proposal.totalPrice != null
              ? `${proposal.totalPrice} ${proposal.currency ?? ""}`
              : "Price not specified"}
            {" · "}
            {proposal.deliveryDays != null
              ? `${proposal.deliveryDays} days delivery`
              : "Delivery not specified"}
            {" · "}
            {proposal.warrantyMonths != null
              ? `${proposal.warrantyMonths} months warranty`
              : "Warranty not specified"}
          </p>
        </div>
        <div className="text-right text-xs text-slate-700">
          {rank != null && (
            <p className="font-medium text-emerald-800">
              Rank: #{rank}
            </p>
          )}
          <p className="text-[11px] text-slate-600">
            Total score: {proposal.scores.scoreOutOf10.toFixed(2)} / 10
          </p>
          <p className="text-[11px] text-slate-600">
            Source: {proposal.source}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProposalInlineDetails({ proposal }: { proposal: ComparisonProposal }) {
  const s = proposal.scores;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Proposal details
          </p>
          <h3 className="mt-1 text-sm font-semibold text-slate-900">
            {proposal.vendor.name}
          </h3>
          <p className="mt-1 text-xs text-slate-700">
            {proposal.totalPrice != null
              ? `${proposal.totalPrice} ${proposal.currency ?? ""}`
              : "Price not specified"}
            {" · "}
            {proposal.deliveryDays != null
              ? `${proposal.deliveryDays} days delivery`
              : "Delivery not specified"}
            {" · "}
            {proposal.warrantyMonths != null
              ? `${proposal.warrantyMonths} months warranty`
              : "Warranty not specified"}
          </p>
        </div>
        <div className="text-xs text-slate-700 md:text-right">
          <p className="font-medium text-slate-900">
            Total score: {s.totalScore.toFixed(3)} / 1
          </p>
          <p className="text-[11px] text-slate-600">
            Created: {new Date(proposal.createdAt).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-600">
            Source: {proposal.source}
          </p>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-3 gap-3 text-xs text-slate-700 md:w-[420px]">
        <ScoreField label="Price score" value={s.priceScore} />
        <ScoreField label="Delivery score" value={s.deliveryScore} />
        <ScoreField label="Warranty score" value={s.warrantyScore} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-700 md:w-[420px]">
        <DetailField
          label="Terms"
          value={proposal.terms ?? "—"}
        />
        <DetailField
          label="Notes"
          value={proposal.notes ?? "—"}
        />
      </div>
    </div>
  );
}

function ScoreField({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-slate-800">
        {value.toFixed(3)} / 1
      </p>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-slate-800">
        {value}
      </p>
    </div>
  );
}
