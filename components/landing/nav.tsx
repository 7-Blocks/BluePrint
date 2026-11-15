"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Product", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-14 flex items-center transition-all duration-300 ${
        scrolled ? "bg-[#090909]/95 backdrop-blur-md border-b border-[#1a1a1a]" : "bg-transparent"
      }`}
    >
      <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[8px] bg-white flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="#090909" />
              <rect x="9" y="2" width="5" height="5" rx="1" fill="#090909" />
              <rect x="2" y="9" width="5" height="5" rx="1" fill="#090909" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="#090909" opacity="0.4" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-white tracking-tight">Blueprint</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-[14px] text-[#999] hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login">
            <Button variant="secondary" size="sm">Sign in</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">Get started</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-[#999] hover:text-white hover:bg-[#141414] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-14 left-0 right-0 bg-[#090909] border-b border-[#1a1a1a] p-4 flex flex-col gap-3 md:hidden">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-[15px] text-[#999] hover:text-white py-1" onClick={() => setMobileOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2 border-t border-[#1a1a1a]">
            <Link href="/login" className="flex-1"><Button variant="secondary" size="md" className="w-full">Sign in</Button></Link>
            <Link href="/signup" className="flex-1"><Button variant="primary" size="md" className="w-full">Get started</Button></Link>
          </div>
        </div>
      )}
    </nav>
  );
}
