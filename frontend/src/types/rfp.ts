export type Rfp = {
  id: string;
  title: string;

  naturalLanguageInput: string | null;
  structuredSpec: any;

  budget: number | null;
  currency: string | null;

  deliveryDeadline: string | null;
  paymentTerms: string | null;
  minimumWarrantyMonths: number | null;

  createdAt: string;
};
