import { colorMap } from "@/lib/color-map";

type FabricSwatchProps = {
  color: string;
  label?: string;
  className?: string;
  variant?: "primary" | "secondary";
};

export default function FabricSwatch({
  color,
  label,
  className = "",
  variant = "primary",
}: FabricSwatchProps) {
  const baseColor = colorMap[color] ?? color ?? colorMap.beige;
  const overlayClass =
    variant === "secondary"
      ? "bg-[linear-gradient(135deg,rgba(0,0,0,0.2),transparent_65%)]"
      : "bg-[linear-gradient(135deg,rgba(255,255,255,0.5),transparent_65%)]";

  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: baseColor }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_rgba(255,255,255,0)_60%)]" />
      <div className={`absolute inset-0 ${overlayClass}`} />
      <div className="absolute inset-0 opacity-20 mix-blend-multiply bg-[radial-gradient(circle_at_20%_30%,_rgba(255,255,255,0.45),_rgba(255,255,255,0)_60%)]" />
    </div>
  );
}
