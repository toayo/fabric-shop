"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

export type TabOption = {
  label: string;
  value: string;
};

type FilterTabsProps = {
  options: TabOption[];
  value: string;
  onChange: (value: string) => void;
};

export default function FilterTabs({ options, value, onChange }: FilterTabsProps) {
  return (
    <div className="relative flex flex-wrap gap-3 rounded-full bg-white p-1 shadow-sm">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={clsx(
            "relative rounded-full px-4 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
            value === option.value ? "text-brand" : "text-cocoa/70 hover:text-brand"
          )}
        >
          <span className="relative z-10">{option.label}</span>
          {value === option.value && (
            <motion.span
              layoutId="tab-underline"
              className="absolute inset-0 rounded-full bg-brand/10"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
