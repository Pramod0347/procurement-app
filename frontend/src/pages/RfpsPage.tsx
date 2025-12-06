import React, { useEffect, useState } from "react";
import { getAllRfps } from "../api/rfp";
import { getAllVendors } from "../api/vendor";
import type { Rfp, Vendor } from "../types";
import { RfpCreateModal } from "../components/RfpCreateModal";

export function RfpsPage() {
  const [rfps, setRfps] = useState<Rfp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [expandedRfpId, setExpandedRfpId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data = await getAllRfps();
        setRfps(data);
      } catch (err: any) {
        console.error("Failed to load RFPs", err);
        setError(err.message ?? "Failed to load RFPs");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function handleRfpCreated(newRfp: Rfp) {
    // Add new RFP at top of list
    setRfps((prev) => [newRfp, ...prev]);
    // Optionally expand it immediately
    setExpandedRfpId(newRfp.id);
  }

  function toggleExpanded(rfpId: string) {
    setExpandedRfpId((current) => (current === rfpId ? null : rfpId));
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase text-indigo-600">
              RFPs
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              Requests for proposal
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              View and manage all active and historical RFPs.
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
          >
            New RFP
          </button>
        </header>

        {/* Content states */}
        {loading && (
          <p className="text-sm text-slate-600">Loading RFPs…</p>
        )}

        {error && (
          <p className="mb-4 text-sm text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && rfps.length === 0 && (
          <p className="text-sm text-slate-600">
            No RFPs found yet. Create one from the dashboard or using the
            “New RFP” button.
          </p>
        )}

        {!loading && !error && rfps.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Budget
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Deadline
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Currency
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rfps.map((rfp) => (
                  <React.Fragment key={rfp.id}>
                    {/* Main row */}
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {rfp.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {rfp.budget != null ? rfp.budget : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {rfp.deliveryDeadline
                          ? new Date(
                              rfp.deliveryDeadline
                            ).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {rfp.currency ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {new Date(rfp.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => toggleExpanded(rfp.id)}
                          className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          {expandedRfpId === rfp.id ? "Hide" : "Details"}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded details row */}
                    {expandedRfpId === rfp.id && (
                      <tr className="bg-slate-50/60">
                        <td className="px-4 pb-4 pt-1" colSpan={6}>
                          <RfpInlineDetails rfp={rfp} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create RFP modal */}
        <RfpCreateModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreated={handleRfpCreated}
        />
      </div>
    </div>
  );
}

type RfpInlineDetailsProps = {
  rfp: Rfp;
};

function RfpInlineDetails({ rfp }: RfpInlineDetailsProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [vendorsError, setVendorsError] = useState<string | null>(null);
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadVendors() {
      try {
        setVendorsLoading(true);
        setVendorsError(null);
        const data = await getAllVendors();
        setVendors(data);
        // later we’ll hydrate selectedVendorIds from backend RFP-vendor relation
      } catch (err: any) {
        console.error("Failed to load vendors", err);
        setVendorsError(err.message ?? "Failed to load vendors");
      } finally {
        setVendorsLoading(false);
      }
    }

    loadVendors();
  }, []);

  function toggleVendor(vendorId: string) {
    setSelectedVendorIds((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      {/* Overview */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Overview
          </p>
          <h3 className="mt-1 text-sm font-semibold text-slate-900">
            {rfp.title}
          </h3>
          {rfp.naturalLanguageInput && (
            <p className="mt-1 text-xs text-slate-600">
              {rfp.naturalLanguageInput}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 md:w-64">
          <DetailField
            label="Budget"
            value={rfp.budget != null ? String(rfp.budget) : "—"}
          />
          <DetailField label="Currency" value={rfp.currency ?? "—"} />
          <DetailField
            label="Delivery deadline"
            value={
              rfp.deliveryDeadline
                ? new Date(rfp.deliveryDeadline).toLocaleDateString()
                : "—"
            }
          />
          <DetailField
            label="Warranty (months)"
            value={
              rfp.minimumWarrantyMonths != null
                ? String(rfp.minimumWarrantyMonths)
                : "—"
            }
          />
          <DetailField
            label="Payment terms"
            value={rfp.paymentTerms ?? "—"}
          />
          <DetailField
            label="Created"
            value={new Date(rfp.createdAt).toLocaleString()}
          />
        </div>
      </div>

      {/* Vendors for this RFP */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Vendors for this RFP
          </p>
          <span className="text-[11px] text-slate-500">
            {selectedVendorIds.length} selected
          </span>
        </div>

        <div className="mt-2 max-h-40 overflow-auto rounded-lg bg-white">
          {vendorsLoading && (
            <p className="px-3 py-2 text-xs text-slate-500">
              Loading vendors…
            </p>
          )}

          {vendorsError && (
            <p className="px-3 py-2 text-xs text-red-600">
              {vendorsError}
            </p>
          )}

          {!vendorsLoading && !vendorsError && vendors.length === 0 && (
            <p className="px-3 py-2 text-xs text-slate-500">
              No vendors found yet. Add vendors from the Vendors page.
            </p>
          )}

          {!vendorsLoading && !vendorsError && vendors.length > 0 && (
            <ul className="divide-y divide-slate-100 text-xs">
              {vendors.map((vendor) => {
                const checked = selectedVendorIds.includes(vendor.id);
                return (
                  <li
                    key={vendor.id}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleVendor(vendor.id)}
                      className="h-3 w-3 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-slate-800">
                        {vendor.name}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {vendor.email}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">
            Email sending is not wired up yet. This selection will be used once
            we add RFP invitations.
          </p>
          <button
            disabled
            className="inline-flex items-center rounded-full bg-slate-300 px-3 py-1 text-[11px] font-medium text-slate-700 opacity-80"
          >
            Send RFP to {selectedVendorIds.length || "—"} vendors
          </button>
        </div>
      </div>

      {/* Structured spec */}
      <div className="mt-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          Structured spec (raw)
        </p>
        <pre className="mt-1 max-h-52 overflow-auto rounded-lg bg-slate-900 p-3 text-[11px] leading-relaxed text-slate-50">
{JSON.stringify(rfp.structuredSpec, null, 2)}
        </pre>
      </div>
    </div>
  );
}

type DetailFieldProps = {
  label: string;
  value: string;
};

function DetailField({ label, value }: DetailFieldProps) {
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
