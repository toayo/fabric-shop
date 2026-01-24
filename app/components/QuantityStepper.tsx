"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { isValidLength } from "@/lib/validation";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
};

export default function QuantityStepper({ value, onChange }: QuantityStepperProps) {
  const [input, setInput] = useState(value.toString());

  const updateValue = (next: number) => {
    const rounded = Math.round(next * 100) / 100;
    if (isValidLength(rounded)) {
      onChange(rounded);
      setInput(rounded.toFixed(2));
    }
  };

  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="rounded-full border border-cocoa/20 px-3 py-1 text-lg"
        onClick={() => updateValue(Math.max(0.25, value - 0.25))}
        aria-label="Decrease length"
      >
        -
      </motion.button>
      <div className="flex flex-col">
        <label className="text-xs uppercase text-cocoa/60">Length to cut</label>
        <input
          type="number"
          step={0.25}
          min={0.25}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onBlur={() => {
            const parsed = Number.parseFloat(input);
            if (isValidLength(parsed)) {
              onChange(parsed);
              setInput(parsed.toFixed(2));
            } else {
              setInput(value.toFixed(2));
            }
          }}
          className="mt-1 w-28 rounded-full border border-cocoa/20 bg-white px-3 py-2 text-sm"
        />
        <span className="mt-1 text-[11px] text-cocoa/50">How much to cut off</span>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="rounded-full border border-cocoa/20 px-3 py-1 text-lg"
        onClick={() => updateValue(value + 0.25)}
        aria-label="Increase length"
      >
        +
      </motion.button>
    </div>
  );
}
