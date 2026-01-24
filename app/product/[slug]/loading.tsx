import SkeletonCard from "@/app/components/SkeletonCard";

export default function LoadingProduct() {
  return (
    <div className="container pb-20">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="skeleton aspect-[4/3] rounded-[32px]" />
          <div className="mt-4 flex gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="skeleton h-20 w-24" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="skeleton h-6 w-1/3" />
          <div className="skeleton h-4 w-2/3" />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
