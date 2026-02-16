export const isValidLength = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    return false;
  }
  const step = 0.25;
  return Math.round(value / step) * step === value;
};

export const isValidQuantity = (value: number, unit: "yard" | "meter" | "spool") => {
  if (!Number.isFinite(value) || value <= 0) {
    return false;
  }
  if (unit === "spool") {
    return Number.isInteger(value);
  }
  return isValidLength(value);
};
