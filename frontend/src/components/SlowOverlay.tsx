import { useEffect, useState } from "react";
import { slowOverlayEvents } from "../lib/slowOverlay";

export function SlowOverlay() {
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    const handleStart = () => setDepth((d) => d + 1);
    const handleEnd = () => setDepth((d) => Math.max(0, d - 1));

    document.addEventListener(slowOverlayEvents.start, handleStart);
    document.addEventListener(slowOverlayEvents.end, handleEnd);

    return () => {
      document.removeEventListener(slowOverlayEvents.start, handleStart);
      document.removeEventListener(slowOverlayEvents.end, handleEnd);
    };
  }, []);

  if (depth === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/75 backdrop-blur-sm">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white/90 px-6 py-4 text-center shadow-xl">
        <p className="text-sm font-semibold text-slate-900">
          Warming up the engines…
        </p>
        <p className="mt-1 text-sm text-slate-700">
          Our free Render backend is rubbing the sleep out of its eyes. Give it
          a minute to spin up, we’ll pull in your data as soon as it’s awake.
        </p>
      </div>
    </div>
  );
}
