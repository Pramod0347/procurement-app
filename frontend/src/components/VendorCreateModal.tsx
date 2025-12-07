import React, { useState } from "react";
import { createVendor } from "../api/vendor";
import type { Vendor } from "../types";

type VendorCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (vendor: Vendor) => void;
};

export function VendorCreateModal({
  isOpen,
  onClose,
  onCreated,
}: VendorCreateModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const vendor = await createVendor({
        name,
        email,
        contactPerson: contactPerson || undefined,
        notes: notes || undefined,
      });

      onCreated?.(vendor);

      setName("");
      setEmail("");
      setContactPerson("");
      setNotes("");

      onClose();
    } catch (err: any) {
      setError(err.message ?? "Failed to create vendor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.target === e.currentTarget && !loading) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
      onClick={handleBackdrop}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">New Vendor</h2>
          <button
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Vendor Name
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              value={name}
              disabled={loading}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Contact Person
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              value={contactPerson}
              disabled={loading}
              onChange={(e) => setContactPerson(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Notes
            </label>
            <textarea
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              rows={3}
              value={notes}
              disabled={loading}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-70"
            >
              {loading ? "Saving…" : "Create Vendor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
