"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { isValidQuantity } from "@/lib/validation";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  unit?: "yard" | "meter" | "spool";
};

export default function QuantityStepper({
  value,
  onChange,
  unit = "yard",
}: QuantityStepperProps) {
  const [input, setInput] = useState(value.toString());

  const updateValue = (next: number) => {
    const rounded = Math.round(next * 100) / 100;
    const normalized = unit === "spool" ? Math.round(next) : rounded;
    if (isValidQuantity(normalized, unit)) {
      onChange(normalized);
      setInput(unit === "spool" ? normalized.toString() : normalized.toFixed(2));
    }
  };

  const step = unit === "spool" ? 1 : 0.25;
  const min = unit === "spool" ? 1 : 0.25;
  const label = unit === "spool" ? "Quantity" : "Length to cut";
  const helper = unit === "spool" ? "How many spools to add" : "How much to cut off";

  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="rounded-full border border-theme px-3 py-1 text-lg text-[var(--text)] hover:text-[var(--accent)]"
        onClick={() => updateValue(Math.max(min, value - step))}
        aria-label={unit === "spool" ? "Decrease quantity" : "Decrease length"}
      >
        -
      </motion.button>
      <div className="flex flex-col">
        <label className="text-xs uppercase text-[var(--muted)]">{label}</label>
        <input
          type="number"
          step={step}
          min={min}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onBlur={() => {
            const parsed = Number.parseFloat(input);
            const normalized = unit === "spool" ? Math.round(parsed) : parsed;
            if (isValidQuantity(normalized, unit)) {
              onChange(normalized);
              setInput(unit === "spool" ? normalized.toString() : normalized.toFixed(2));
            } else {
              setInput(unit === "spool" ? value.toString() : value.toFixed(2));
            }
          }}
          className="input-theme mt-1 w-28 rounded-full px-3 py-2 text-sm"
        />
        <span className="mt-1 text-[11px] text-[var(--muted)]">{helper}</span>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="rounded-full border border-theme px-3 py-1 text-lg text-[var(--text)] hover:text-[var(--accent)]"
        onClick={() => updateValue(value + step)}
        aria-label={unit === "spool" ? "Increase quantity" : "Increase length"}
      >
        +
      </motion.button>
    </div>
  );
}
