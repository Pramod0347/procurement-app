const START_EVENT = "slow-overlay:start";
const END_EVENT = "slow-overlay:end";
const THRESHOLD_MS = 3000;

function dispatchStart() {
  document.dispatchEvent(new CustomEvent(START_EVENT));
}

function dispatchEnd() {
  document.dispatchEvent(new CustomEvent(END_EVENT));
}

export function trackSlowFetch<T>(promise: Promise<T>): Promise<T> {
  const timer = window.setTimeout(dispatchStart, THRESHOLD_MS);

  return promise
    .catch((err) => {
      throw err;
    })
    .finally(() => {
      clearTimeout(timer);
      dispatchEnd();
    });
}

export function fetchWithSlowOverlay(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  return trackSlowFetch(fetch(input, init));
}

export const slowOverlayEvents = {
  start: START_EVENT,
  end: END_EVENT,
};
