"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { fabricColors, fabricTypeSlugs, fabricTypes } from "@/data/products";
import { formatCategoryName, formatColorName } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const navLink = (href: string, label: string, pathname: string) => (
  <Link
    href={href}
    className={clsx(
      "relative text-base font-semibold text-[#f8f2ff] transition hover:text-[var(--accent)] hover:drop-shadow-[0_0_8px_rgba(227,182,111,0.35)]",
      pathname === href &&
        "text-[var(--accent)] drop-shadow-[0_0_6px_rgba(227,182,111,0.45)] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-[var(--accent)]"
    )}
  >
    {label}
  </Link>
);

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [fabricOpen, setFabricOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const items = useCartStore((state) => state.items);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-theme bg-[var(--bg)] backdrop-blur-lg">
      <div className="navbar container py-4">
        <Link href="/" className="flex items-center text-[var(--text)]">
          <img
            src="https://res.cloudinary.com/dpw4t8gnb/image/upload/v1771205338/ChatGPT_Image_Feb_9_2026_11_21_18_PM_kfedix.png"
            alt="Harvey's"
            className="navbar-logo"
          />
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {navLink("/", "Home", pathname)}
          {navLink("/shop", "Shop", pathname)}
          <div className="relative">
            <button
              onMouseEnter={() => setFabricOpen(true)}
              onMouseLeave={() => setFabricOpen(false)}
              onFocus={() => setFabricOpen(true)}
              className="text-base font-semibold text-[#f8f2ff] transition hover:text-[var(--accent)] hover:drop-shadow-[0_0_8px_rgba(227,182,111,0.35)]"
              aria-haspopup="true"
              aria-expanded={fabricOpen}
            >
              Fabrics
            </button>
            <AnimatePresence>
              {fabricOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-3 grid w-44 gap-2 rounded-2xl border border-theme bg-[var(--surface)] p-4 shadow-soft"
                  onMouseEnter={() => setFabricOpen(true)}
                  onMouseLeave={() => setFabricOpen(false)}
                >
                  {fabricTypes.map((type) => (
                    <Link
                      key={type}
                      href={`/fabrics/${fabricTypeSlugs[type]}`}
                      className="text-sm capitalize text-[var(--muted)] transition hover:text-[var(--accent)]"
                    >
                      {formatCategoryName(type)}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="relative">
            <button
              onMouseEnter={() => setColorOpen(true)}
              onMouseLeave={() => setColorOpen(false)}
              onFocus={() => setColorOpen(true)}
              className="text-base font-semibold text-[#f8f2ff] transition hover:text-[var(--accent)] hover:drop-shadow-[0_0_8px_rgba(227,182,111,0.35)]"
              aria-haspopup="true"
              aria-expanded={colorOpen}
            >
              Colors
            </button>
            <AnimatePresence>
              {colorOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-3 grid w-44 gap-2 rounded-2xl border border-theme bg-[var(--surface)] p-4 shadow-soft"
                  onMouseEnter={() => setColorOpen(true)}
                  onMouseLeave={() => setColorOpen(false)}
                >
                  {fabricColors.map((color) => (
                    <Link
                      key={color}
                      href={`/colors/${color}`}
                      className="text-sm capitalize text-[var(--muted)] transition hover:text-[var(--accent)]"
                    >
                      {formatColorName(color)}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {navLink("/about", "About", pathname)}
          {navLink("/contact", "Contact", pathname)}
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-full border border-[#d8b26b77] bg-[var(--surface2)] px-3 py-2 text-sm font-semibold text-[#f8f2ff] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            aria-label={`View cart (${items.length} items)`}
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#d8b26baa] bg-[var(--surface)] text-sm">
              🛒
            </span>
            <span>Cart</span>
            {items.length > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs text-[var(--bg)]">
                {items.length}
              </span>
            )}
          </Link>
        </nav>
        <button
          className="flex items-center gap-2 rounded-full border border-theme bg-[var(--surface2)] px-3 py-2 text-sm text-[var(--text)] lg:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          Menu
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-80 border-l border-theme bg-[var(--surface)] p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <img
                  src="https://res.cloudinary.com/dpw4t8gnb/image/upload/v1771205338/ChatGPT_Image_Feb_9_2026_11_21_18_PM_kfedix.png"
                  alt="Harvey's"
                  className="navbar-logo"
                />
                <button
                  className="text-sm text-[var(--muted)]"
                  onClick={() => setMenuOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className="mt-6 grid gap-4 text-sm">
                {navLink("/", "Home", pathname)}
                {navLink("/shop", "Shop", pathname)}
                <div>
                  <p className="text-xs uppercase text-[var(--muted)]">Fabrics</p>
                  <div className="mt-2 grid gap-2">
                    {fabricTypes.map((type) => (
                      <Link
                        key={type}
                        href={`/fabrics/${fabricTypeSlugs[type]}`}
                        className="capitalize text-[var(--muted)] transition hover:text-[var(--accent)]"
                        onClick={() => setMenuOpen(false)}
                      >
                        {formatCategoryName(type)}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase text-[var(--muted)]">Colors</p>
                  <div className="mt-2 grid gap-2">
                    {fabricColors.map((color) => (
                      <Link
                        key={color}
                        href={`/colors/${color}`}
                        className="capitalize text-[var(--muted)] transition hover:text-[var(--accent)]"
                        onClick={() => setMenuOpen(false)}
                      >
                        {formatColorName(color)}
                      </Link>
                    ))}
                  </div>
                </div>
                {navLink("/about", "About", pathname)}
                {navLink("/contact", "Contact", pathname)}
                <Link
                  href="/cart"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d8b26b77] bg-[var(--surface2)] px-3 py-2 font-semibold text-[#f8f2ff] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#d8b26baa] bg-[var(--surface)] text-xs">
                    🛒
                  </span>
                  Cart ({items.length})
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
