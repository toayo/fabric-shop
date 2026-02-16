export default function ContactPage() {
  return (
    <div className="container pb-20">
      <div className="rounded-3xl p-10 shadow-sm surface card-hover">
        <h1 className="text-3xl font-semibold">Contact</h1>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Reach our team for sourcing support, bulk orders, or delivery questions. We respond
          within one business day.
        </p>
        <div className="mt-6 space-y-2 text-sm text-[var(--muted)]">
          <p>Email: Fandsessentials@gmail.com</p>
          <p>Phone: +1 (658) 207-5856</p>
          <p>Address: 61 Main St, Ocho Rios, St Ann, Jamaica</p>
          <p>Hours: Mon - Sat, 9:00am - 6:00pm</p>
        </div>
      </div>
    </div>
  );
}
