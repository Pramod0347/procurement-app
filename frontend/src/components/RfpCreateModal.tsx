import React, { useState } from "react";
import type { Rfp } from "../types";
import { createRfp } from "../api/rfp";

type RfpCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (rfp: Rfp) => void;
};

export function RfpCreateModal({
  isOpen,
  onClose,
  onCreated,
}: RfpCreateModalProps) {
  const [title, setTitle] = useState("");
  const [naturalInput, setNaturalInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !naturalInput.trim()) {
      setError("Title and description are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const rfp = await createRfp({
        title: title.trim(),
        naturalLanguageInput: naturalInput.trim(),
      });

      if (onCreated) {
        onCreated(rfp);
      }

      setTitle("");
      setNaturalInput("");

      onClose();
    } catch (err: any) {
      console.error("Failed to create RFP", err);
      setError(err.message ?? "Failed to create RFP");
    } finally {
      setLoading(false);
    }
  }

  function handleBackdropClick(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              New RFP
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Give this request a clear title and describe what you need
              from vendors.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Title
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              placeholder="e.g. Marketing laptop refresh Q2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Description
            </label>
            <textarea
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              rows={5}
              placeholder="Describe the requirements, budget guidance, timelines, and any constraints..."
              value={naturalInput}
              onChange={(e) => setNaturalInput(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-70"
            >
              {loading ? "Creating..." : "Create RFP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
