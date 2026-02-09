import { colorMap } from "@/lib/color-map";

type ProductMediaProps = {
  image?: string | null;
  color?: string | null;
  label: string;
  className?: string;
};

export default function ProductMedia({
  image,
  color,
  label,
  className = "",
}: ProductMediaProps) {
  const swatchColor = color ? colorMap[color] ?? color : undefined;
  const style = image
    ? { backgroundImage: `url(${image})` }
    : swatchColor
      ? { backgroundColor: swatchColor }
      : undefined;

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative overflow-hidden bg-[var(--surface2)] bg-cover bg-center ${className}`}
      style={style}
    />
  );
}
