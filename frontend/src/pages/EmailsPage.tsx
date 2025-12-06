import React, { useEffect, useState } from "react";
import { getAllEmails } from "../api/email";
import type { EmailMessage } from "../types";

// helper: extract RFP reference from subject
function extractRfpSelectorFromSubject(
  subject: string | null | undefined
): { rfpId?: string; keyword?: string } {
  if (!subject) return {};

  // Pattern 1: RFPID:cmisghrjt0003peit8md1a9fq
  const idMatch = subject.match(/\bRFPID\s*[:\-]\s*([a-zA-Z0-9]+)/i);
  if (idMatch && idMatch[1]) {
    return { rfpId: idMatch[1] };
  }

  // Pattern 2: RFP: Laptops Procurement
  const keywordMatch = subject.match(/\bRFP\s*[:\-]\s*(.+)$/i);
  if (keywordMatch && keywordMatch[1]) {
    return { keyword: keywordMatch[1].trim() };
  }

  return {};
}

export function EmailsPage() {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllEmails();
        setEmails(data);
      } catch (err: any) {
        console.error("Failed to load emails", err);
        setError(err.message ?? "Failed to load emails");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function toggleExpanded(id: string) {
    setExpandedEmailId((current) => (current === id ? null : id));
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase text-indigo-600">
              Emails
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              Vendor inbox
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              See incoming vendor messages linked to your RFPs.
            </p>
          </div>
        </header>

        {/* States */}
        {loading && (
          <p className="text-sm text-slate-600">Loading emails…</p>
        )}

        {error && (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && emails.length === 0 && (
          <p className="text-sm text-slate-600">
            No emails recorded yet. Once vendors start replying to your RFP
            address, messages will show up here.
          </p>
        )}

        {!loading && !error && emails.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    From
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    To
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Received
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {emails.map((email) => {
                  const rfpRef = extractRfpSelectorFromSubject(email.subject);

                  return (
                    <React.Fragment key={email.id}>
                      {/* Main row */}
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-900">
                          {email.from ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {email.to ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                          {email.subject ?? "—"}
                          {rfpRef.rfpId && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                              RFPID: {rfpRef.rfpId}
                            </span>
                          )}
                          {!rfpRef.rfpId && rfpRef.keyword && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                              RFP: {rfpRef.keyword}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          <span
                            className={
                              "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium " +
                              (email.status === "PARSED"
                                ? "bg-emerald-50 text-emerald-700"
                                : email.status === "PENDING"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-50 text-slate-600")
                            }
                          >
                            {email.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {new Date(email.receivedAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => toggleExpanded(email.id)}
                            className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            {expandedEmailId === email.id ? "Hide" : "Details"}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded row */}
                      {expandedEmailId === email.id && (
                        <tr className="bg-slate-50/60">
                          <td className="px-4 pb-4 pt-1" colSpan={6}>
                            <EmailInlineDetails email={email} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// inline details block
function EmailInlineDetails({ email }: { email: EmailMessage }) {
  const rfpRef = extractRfpSelectorFromSubject(email.subject);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      {/* Summary header text */}
      <p className="text-xs text-slate-600">
        <span className="font-semibold text-slate-900">
          {email.from ?? "Unknown sender"}
        </span>{" "}
        sent an email to{" "}
        <span className="font-semibold text-slate-900">
          {email.to ?? "your RFP address"}
        </span>{" "}
        about{" "}
        <span className="font-semibold text-slate-900">
          {email.subject ?? "no subject"}
        </span>
        {rfpRef.rfpId && (
          <>
            {" "}
            referencing{" "}
            <span className="font-semibold text-indigo-700">
              RFPID: {rfpRef.rfpId}
            </span>
          </>
        )}
        {!rfpRef.rfpId && rfpRef.keyword && (
          <>
            {" "}
            referencing RFP titled{" "}
            <span className="font-semibold text-indigo-700">
              {rfpRef.keyword}
            </span>
          </>
        )}
        .
      </p>

      {/* Meta fields */}
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-700 md:w-[420px]">
        <DetailField label="From" value={email.from ?? "—"} />
        <DetailField label="To" value={email.to ?? "—"} />
        <DetailField
          label="Status"
          value={email.status}
        />
        <DetailField
          label="Received at"
          value={new Date(email.receivedAt).toLocaleString()}
        />
        <DetailField
          label="Message ID"
          value={email.messageId ?? "—"}
        />
      </div>

      {/* Body (text only) */}
      {email.bodyText && (
        <div className="mt-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Email body (text)
          </p>
          <div className="mt-1 max-h-52 overflow-auto rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] leading-relaxed text-slate-800 whitespace-pre-wrap">
            {email.bodyText}
          </div>
        </div>
      )}
    </div>
  );
}

// small reusable label/value component
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
