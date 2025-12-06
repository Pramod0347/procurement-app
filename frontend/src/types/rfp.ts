// src/types/rfp.ts

export type Rfp = {
  id: string;
  title: string;

  naturalLanguageInput: string | null;
  structuredSpec: any;

  budget: number | null;
  currency: string | null;

  deliveryDeadline: string | null; // will be an ISO date string from backend
  paymentTerms: string | null;
  minimumWarrantyMonths: number | null;

  createdAt: string; // ISO string
};
