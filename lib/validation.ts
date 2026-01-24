export const isValidLength = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    return false;
  }
  const step = 0.25;
  return Math.round(value / step) * step === value;
};
