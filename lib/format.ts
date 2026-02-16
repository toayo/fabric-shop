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

export const formatUnit = (unit: "yard" | "meter" | "spool") => {
  if (unit === "spool") {
    return "per spool";
  }
  return unit === "yard" ? "per yard" : "per meter";
};

export const formatQuantity = (value: number, unit: "yard" | "meter" | "spool") =>
  unit === "spool" ? Math.round(value).toString() : value.toFixed(2);

export const formatCategoryName = (value: string) =>
  value
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const formatColorName = (value: string) =>
  value === "multicolor" ? "Multicolor" : formatCategoryName(value);
