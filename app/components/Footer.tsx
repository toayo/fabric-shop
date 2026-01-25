export default function Footer() {
  return (
    <footer className="mt-20 border-t border-theme bg-[var(--surface)]">
      <div className="container grid gap-10 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)]">Harvey&apos;s</h3>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Premium fabrics in Jamaica, curated for designers, tailors, and
            creative studios.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[var(--text)]">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li>hello@harveysfabrics.com</li>
            <li>Kingston, Jamaica</li>
            <li>+1 (876) 555-0123</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[var(--text)]">Follow</h4>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li>Instagram</li>
            <li>Facebook</li>
            <li>Pinterest</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-theme py-6 text-center text-xs text-[var(--muted)]">
        © {new Date().getFullYear()} Harvey&apos;s. All rights reserved.
      </div>
    </footer>
  );
}
