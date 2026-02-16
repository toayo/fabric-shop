const defaultShippingConfig = {
  id: "default",
  kingstonFee: 1500,
  otherParishFee: 2200,
  pickupFee: 0,
};

export const getShippingConfig = async () => defaultShippingConfig;

export const getShippingFee = (
  config: { kingstonFee: number; otherParishFee: number; pickupFee: number },
  parish: string,
  deliveryMethod: "delivery" | "pickup"
) => {
  if (deliveryMethod === "pickup") {
    return config.pickupFee;
  }
  const normalized = parish.toLowerCase();
  if (["kingston", "st. andrew", "st andrew", "st.andrew"].includes(normalized)) {
    return config.kingstonFee;
  }
  return config.otherParishFee;
};
