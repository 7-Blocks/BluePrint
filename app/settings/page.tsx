"use client";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store";
import { AppNav } from "@/components/navigation/app-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const SECTIONS = ["Profile", "Workspace", "Appearance", "Notifications"] as const;

export default function SettingsPage() {
  const { user, initAuth } = useAppStore();
  const [section, setSection] = useState<typeof SECTIONS[number]>("Profile");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [org, setOrg] = useState(user?.organization || "");
  const [notifications, setNotifications] = useState({ email: true, inApp: true, weekly: false });

  useEffect(() => {
    initAuth();
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  return (
    <div className="min-h-screen bg-[#090909]">
      <AppNav />
      <main className="max-w-[900px] mx-auto px-6 py-10">
        <h1 className="text-[24px] font-semibold text-white tracking-tight mb-8">Settings</h1>
        <div className="flex gap-8">
          <div className="w-44 flex-shrink-0">
            <nav className="space-y-0.5">
              {SECTIONS.map((s) => (
                <button key={s} onClick={() => setSection(s)}
                  className={`w-full text-left px-3 py-2 rounded-[8px] text-[13px] font-medium transition-colors ${
                    section === s ? "bg-[#141414] text-white" : "text-[#555] hover:text-white hover:bg-[#141414]"
                  }`}>
                  {s}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex-1">
            {section === "Profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[16px] font-semibold text-white mb-1">Personal profile</h2>
                  <p className="text-[13px] text-[#555]">Update your personal information.</p>
                </div>
                <div className="bg-[#141414] border border-[#262626] rounded-[20px] p-6 space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-14 h-14 rounded-full bg-[#6a4cf5] flex items-center justify-center text-[20px] font-semibold text-white">
                      {name[0]?.toUpperCase() || "A"}
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-white">{name}</p>
                      <p className="text-[12px] text-[#555]">{email}</p>
                    </div>
                  </div>
                  <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                  <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Input label="Organization" value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Your company or studio" />
                  <Button variant="primary" size="md" onClick={() => toast.success("Profile updated")}>Save changes</Button>
                </div>
              </div>
            )}
            {section === "Workspace" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[16px] font-semibold text-white mb-1">Workspace</h2>
                  <p className="text-[13px] text-[#555]">Manage your workspace settings.</p>
                </div>
                <div className="bg-[#141414] border border-[#262626] rounded-[20px] p-6 space-y-4">
                  <Input label="Workspace name" defaultValue="Rivera Studio" />
                  <Input label="Workspace URL" defaultValue="rivera-studio" hint="Blueprint.io/w/rivera-studio" />
                  <Button variant="primary" size="md" onClick={() => toast.success("Workspace updated")}>Save changes</Button>
                </div>
              </div>
            )}
            {section === "Appearance" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[16px] font-semibold text-white mb-1">Appearance</h2>
                  <p className="text-[13px] text-[#555]">Customize how Blueprint looks.</p>
                </div>
                <div className="bg-[#141414] border border-[#262626] rounded-[20px] p-6">
                  <p className="text-[13px] font-medium text-[#555] mb-3">Theme</p>
                  <div className="flex gap-3">
                    {["Dark", "System"].map((t) => (
                      <button key={t} className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-colors ${t === "Dark" ? "bg-[#1c1c1c] border-[#0099ff]/40 text-white" : "bg-transparent border-[#262626] text-[#555] hover:text-white"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                  <p className="text-[12px] text-[#333] mt-3">Light mode coming soon.</p>
                </div>
              </div>
            )}
            {section === "Notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[16px] font-semibold text-white mb-1">Notifications</h2>
                  <p className="text-[13px] text-[#555]">Control when and how you are notified.</p>
                </div>
                <div className="bg-[#141414] border border-[#262626] rounded-[20px] divide-y divide-[#1a1a1a]">
                  {[
                    { key: "email", label: "Email notifications", desc: "Receive notifications via email" },
                    { key: "inApp", label: "In-app notifications", desc: "Show notifications inside the app" },
                    { key: "weekly", label: "Weekly digest", desc: "Weekly summary of project activity" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between px-5 py-4">
                      <div>
                        <p className="text-[14px] font-medium text-white">{label}</p>
                        <p className="text-[12px] text-[#555]">{desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                        className={`w-10 h-6 rounded-full transition-colors relative ${notifications[key as keyof typeof notifications] ? "bg-[#0099ff]" : "bg-[#262626]"}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications[key as keyof typeof notifications] ? "translate-x-5" : "translate-x-1"}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <Button variant="primary" size="md" onClick={() => toast.success("Notification preferences saved")}>Save preferences</Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
