export default function AboutPage() {
  return (
    <div className="container pb-20">
      <div className="rounded-3xl p-10 shadow-sm surface card-hover">
        <h1 className="text-3xl font-semibold">About Harvey&apos;s</h1>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Harvey&apos;s is a premium fabric store built for Jamaica&apos;s fashion designers, boutique
          labels, and creative studios. We curate breathable cottons, luxe silks, and artisan
          lace designed to inspire your next collection.
        </p>
        <p className="mt-4 text-sm text-[var(--muted)]">
          We partner with trusted mills worldwide and provide personalized service for local
          makers, including sourcing assistance and production-ready recommendations.
        </p>
        <div className="mt-6 rounded-2xl border border-theme p-4 text-sm text-[var(--muted)]">
          <p><span className="font-semibold text-[var(--text)]">Address:</span> 61 Main St, Ocho Rios, St Ann, Jamaica</p>
          <p className="mt-1"><span className="font-semibold text-[var(--text)]">Email:</span> Fandsessentials@gmail.com</p>
          <p className="mt-1"><span className="font-semibold text-[var(--text)]">Phone:</span> +1 (658) 207-5856</p>
        </div>
      </div>
    </div>
  );
}
