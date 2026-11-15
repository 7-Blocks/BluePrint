"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FolderOpen, Settings, User, LogOut, ChevronDown, Plus } from "lucide-react";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navLinks = [
    { href: "/projects", label: "Projects", icon: FolderOpen },
  ];

  return (
    <nav className="h-14 bg-[#090909] border-b border-[#1a1a1a] flex items-center px-6 gap-4 sticky top-0 z-40">
      {/* Logo */}
      <Link href="/projects" className="flex items-center gap-2 mr-4">
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

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-[#141414] text-white"
                : "text-[#555] hover:text-white hover:bg-[#141414]"
            )}
          >
            <Icon size={14} />
            {label}
          </Link>
        ))}
      </div>

      <div className="flex-1" />

      {/* New project */}
      <Link href="/projects/new">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black text-[13px] font-medium hover:bg-white/90 transition-colors">
          <Plus size={14} />
          New project
        </button>
      </Link>

      {/* User menu */}
      <div className="relative">
        <button
          className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-[#141414] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="User menu"
        >
          <div className="w-7 h-7 rounded-full bg-[#6a4cf5] flex items-center justify-center text-[12px] font-semibold text-white">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <span className="text-[13px] text-[#999] hidden sm:block">{user?.name || "Account"}</span>
          <ChevronDown size={12} className="text-[#555]" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#141414] border border-[#262626] rounded-[15px] overflow-hidden z-50 shadow-xl">
              <div className="px-4 py-3 border-b border-[#1a1a1a]">
                <p className="text-[13px] font-medium text-white truncate">{user?.name}</p>
                <p className="text-[12px] text-[#555] truncate">{user?.email}</p>
              </div>
              <div className="p-1">
                <Link href="/profile" onClick={() => setMenuOpen(false)}>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] text-[#999] hover:text-white hover:bg-[#1c1c1c] transition-colors">
                    <User size={14} /> Profile
                  </button>
                </Link>
                <Link href="/settings" onClick={() => setMenuOpen(false)}>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] text-[#999] hover:text-white hover:bg-[#1c1c1c] transition-colors">
                    <Settings size={14} /> Settings
                  </button>
                </Link>
                <div className="h-px bg-[#1a1a1a] my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
