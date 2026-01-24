"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { fabricColors, fabricTypes } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { slugify } from "@/lib/slug";

const navLink = (href: string, label: string, pathname: string) => (
  <Link
    href={href}
    className={clsx(
      "text-sm font-medium transition hover:text-brand",
      pathname === href && "text-brand"
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
    <header className="fixed inset-x-0 top-0 z-40 bg-sand/90 backdrop-blur-lg shadow-[0_12px_30px_rgba(56,24,72,0.08)]">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight text-cocoa">
          Harvey&apos;s
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {navLink("/", "Home", pathname)}
          {navLink("/shop", "Shop", pathname)}
          <div className="relative">
            <button
              onMouseEnter={() => setFabricOpen(true)}
              onMouseLeave={() => setFabricOpen(false)}
              onFocus={() => setFabricOpen(true)}
              className="text-sm font-medium transition hover:text-brand"
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
                  className="absolute left-0 mt-3 grid w-44 gap-2 rounded-2xl border border-cocoa/10 bg-white p-4 shadow-soft"
                  onMouseEnter={() => setFabricOpen(true)}
                  onMouseLeave={() => setFabricOpen(false)}
                >
                  {fabricTypes.map((type) => (
                    <Link
                      key={type}
                      href={`/fabrics/${slugify(type)}`}
                      className="rounded-xl px-2 py-1 text-sm capitalize text-cocoa/80 transition hover:bg-brand/10 hover:text-brand"
                    >
                      {type}
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
              className="text-sm font-medium transition hover:text-brand"
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
                  className="absolute left-0 mt-3 grid w-44 gap-2 rounded-2xl border border-cocoa/10 bg-white p-4 shadow-soft"
                  onMouseEnter={() => setColorOpen(true)}
                  onMouseLeave={() => setColorOpen(false)}
                >
                  {fabricColors.map((color) => (
                    <Link
                      key={color}
                      href={`/colors/${slugify(color)}`}
                      className="rounded-xl px-2 py-1 text-sm capitalize text-cocoa/80 transition hover:bg-brand/10 hover:text-brand"
                    >
                      {color}
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
          className="relative text-sm font-medium transition hover:text-brand"
        >
          Cart
          {items.length > 0 && (
            <span className="absolute -right-3 -top-2 rounded-full bg-brand px-2 py-0.5 text-xs text-white">
              {items.length}
            </span>
          )}
        </Link>
      </nav>
      <button
        className="flex items-center gap-2 rounded-full border border-cocoa/20 px-3 py-2 text-sm transition hover:border-brand/40 hover:text-brand lg:hidden"
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
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Harvey&apos;s</span>
                <button
                  className="text-sm text-cocoa/70 transition hover:text-brand"
                  onClick={() => setMenuOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className="mt-6 grid gap-4 text-sm">
                {navLink("/", "Home", pathname)}
                {navLink("/shop", "Shop", pathname)}
                <div>
                  <p className="text-xs uppercase text-cocoa/50">Fabrics</p>
                  <div className="mt-2 grid gap-2">
                    {fabricTypes.map((type) => (
                      <Link
                        key={type}
                        href={`/fabrics/${slugify(type)}`}
                        className="capitalize text-cocoa/80 transition hover:text-brand"
                        onClick={() => setMenuOpen(false)}
                      >
                        {type}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase text-cocoa/50">Colors</p>
                  <div className="mt-2 grid gap-2">
                    {fabricColors.map((color) => (
                      <Link
                        key={color}
                        href={`/colors/${slugify(color)}`}
                        className="capitalize text-cocoa/80 transition hover:text-brand"
                        onClick={() => setMenuOpen(false)}
                      >
                        {color}
                      </Link>
                    ))}
                  </div>
                </div>
                {navLink("/about", "About", pathname)}
                {navLink("/contact", "Contact", pathname)}
                <Link
                  href="/cart"
                  className="text-cocoa/80 transition hover:text-brand"
                  onClick={() => setMenuOpen(false)}
                >
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
