export default function Loading() {
  return (
    <div className="container pb-20 pt-10">
      <div className="rounded-3xl p-10 shadow-sm surface card-hover">
        <div className="skeleton h-4 w-32" />
        <div className="mt-4 space-y-2">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-4 w-2/3" />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-theme p-4">
              <div className="skeleton aspect-[4/3]" />
              <div className="mt-4 space-y-2">
                <div className="skeleton h-3 w-2/3" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
