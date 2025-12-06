import React, { useEffect, useState } from "react";
import { getAllVendors } from "../api/vendor";
import type { Vendor } from "../types";
import { VendorCreateModal } from "../components/VendorCreateModal";

/**
 * Utility to get initials from name
 */
function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(null);

  // Load vendors on mount
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data = await getAllVendors();
        setVendors(data);
      } catch (err: any) {
        console.error("Failed to load vendors", err);
        setError(err.message ?? "Failed to load vendors");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function handleVendorCreated(vendor: Vendor) {
    setVendors((prev) => [vendor, ...prev]);
    setExpandedVendorId(vendor.id);
  }

  function toggleExpanded(id: string) {
    setExpandedVendorId((current) => (current === id ? null : id));
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase text-indigo-600">
              Vendors
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              Supplier directory
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage your supplier information and onboard new vendors.
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
          >
            New Vendor
          </button>
        </header>

        {/* Content states */}
        {loading && (
          <p className="text-sm text-slate-600">Loading vendors…</p>
        )}

        {error && (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && vendors.length === 0 && (
          <p className="text-sm text-slate-600">
            No vendors yet. Use “New Vendor” to add your first supplier.
          </p>
        )}

        {!loading && !error && vendors.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Vendor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Contact Person
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Notes
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
                {vendors.map((vendor) => (
                  <React.Fragment key={vendor.id}>
                    {/* Main row */}
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar with initials */}
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                            {getInitials(vendor.name)}
                          </div>
                          <span className="text-sm font-medium text-slate-900">
                            {vendor.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-700">
                        {vendor.email}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-700">
                        {vendor.contactPerson ?? "—"}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {vendor.notes ?? "—"}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-500">
                        {new Date(vendor.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => toggleExpanded(vendor.id)}
                          className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          {expandedVendorId === vendor.id ? "Hide" : "Details"}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded details */}
                    {expandedVendorId === vendor.id && (
                      <tr className="bg-slate-50/60">
                        <td className="px-4 pb-4 pt-1" colSpan={6}>
                          <VendorInlineDetails vendor={vendor} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        <VendorCreateModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreated={handleVendorCreated}
        />
      </div>
    </div>
  );
}

/* Inline details block */
function VendorInlineDetails({ vendor }: { vendor: Vendor }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="mb-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Vendor Details
        </p>
        <h3 className="mt-1 text-sm font-semibold text-slate-900">
          {vendor.name}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 md:w-96">
        <DetailField label="Email" value={vendor.email} />
        <DetailField
          label="Contact Person"
          value={vendor.contactPerson ?? "—"}
        />
        <DetailField label="Notes" value={vendor.notes ?? "—"} />
        <DetailField
          label="Created"
          value={new Date(vendor.createdAt).toLocaleString()}
        />
      </div>
    </div>
  );
}

/* Reusable label/value block */
function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-slate-800">{value}</p>
    </div>
  );
}
