import { TChecklistCategory } from "@/interface/checklist.interface";

export const yearOptions = [
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" },
  { value: "2027", label: "2027" },
  { value: "2028", label: "2028" },
  { value: "2029", label: "2029" },
  { value: "2030", label: "2030" },
];

export const userTypeOptions = [
  { value: "all", label: "All" },
  { value: "blocked", label: "Blocked" },
  { value: "active", label: "Active" },
];

export const subscriptionTypeOptions = [
  { value: "all", label: "All plans" },
  { value: "premium", label: "Premium" },
  { value: "free", label: "Free" },
];

// same categories as the app's IVF Checklist tabs
export const checklistCategoryOptions: { value: TChecklistCategory; label: string }[] = [
  { value: "MEDICAL", label: "Medical" },
  { value: "FINANCIAL", label: "Financial" },
  { value: "LIFESTYLE", label: "Lifestyle" },
  { value: "WELLBEING", label: "Wellbeing" },
  { value: "PARTNER", label: "Partner" },
  { value: "LOGISTIC", label: "Logistics" },
];
