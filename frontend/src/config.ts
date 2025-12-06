const backendUrl = import.meta.env.VITE_BACKEND_URL;

if (!backendUrl) {
  throw new Error("VITE_BACKEND_URL is not set. Add it to your frontend .env.");
}

export const API_BASE_URL = backendUrl;
