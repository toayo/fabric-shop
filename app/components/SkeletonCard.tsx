export default function SkeletonCard() {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <div className="skeleton aspect-[4/3]" />
      <div className="mt-4 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  );
}
