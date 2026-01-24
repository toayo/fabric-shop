import SkeletonCard from "@/app/components/SkeletonCard";

export default function ColorLoading() {
  return (
    <div className="container pb-20">
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}
