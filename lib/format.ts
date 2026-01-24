export const formatCurrency = (amount: number, currency: string = "JMD") => {
  try {
    return new Intl.NumberFormat("en-JM", {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    return `J$${amount.toFixed(2)}`;
  }
};

export const formatUnit = (unit: "yard" | "meter") =>
  unit === "yard" ? "per yard" : "per meter";
