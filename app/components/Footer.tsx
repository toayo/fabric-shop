export default function Footer() {
  return (
    <footer className="mt-20 border-t border-cocoa/10 bg-white">
      <div className="container grid gap-10 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold">Harvey&apos;s</h3>
          <p className="mt-3 text-sm text-cocoa/70">
            Premium fabrics in Jamaica, curated for designers, tailors, and
            creative studios.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-cocoa/70">
            <li>hello@harveysfabrics.com</li>
            <li>Kingston, Jamaica</li>
            <li>+1 (876) 555-0123</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Follow</h4>
          <ul className="mt-3 space-y-2 text-sm text-cocoa/70">
            <li>Instagram</li>
            <li>Facebook</li>
            <li>Pinterest</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cocoa/10 py-6 text-center text-xs text-cocoa/60">
        © {new Date().getFullYear()} Harvey&apos;s. All rights reserved.
      </div>
    </footer>
  );
}
