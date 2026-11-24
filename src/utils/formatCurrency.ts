// Number() in case the backend serializes amounts as strings
export const formatCurrency = (amount: number | string, currency = "GBP") =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
