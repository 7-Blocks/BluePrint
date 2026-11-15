"use client";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store";
import { AppNav } from "@/components/navigation/app-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, initAuth } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    initAuth();
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  return (
    <div className="min-h-screen bg-[#090909]">
      <AppNav />
      <main className="max-w-[600px] mx-auto px-6 py-10">
        <h1 className="text-[24px] font-semibold text-white tracking-tight mb-8">Profile</h1>
        <div className="bg-[#141414] border border-[#262626] rounded-[20px] p-8">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-full bg-[#6a4cf5] flex items-center justify-center text-[24px] font-semibold text-white">
              {name[0]?.toUpperCase() || "A"}
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-white">{name || "Your Name"}</h2>
              <p className="text-[13px] text-[#555]">{email}</p>
              <p className="text-[12px] text-[#333] mt-0.5 capitalize">{user?.role || "Freelancer"}</p>
            </div>
          </div>
          {editing ? (
            <div className="space-y-4">
              <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input label="Organization" defaultValue={user?.organization || ""} placeholder="Your company or studio" />
              <div className="flex gap-2">
                <Button variant="secondary" size="md" onClick={() => setEditing(false)}>Cancel</Button>
                <Button variant="primary" size="md" onClick={() => { setEditing(false); toast.success("Profile updated"); }}>Save changes</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { label: "Full name", value: name },
                { label: "Email", value: email },
                { label: "Role", value: user?.role || "Freelancer" },
                { label: "Organization", value: user?.organization || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-[#1a1a1a] last:border-0">
                  <span className="text-[13px] text-[#555]">{label}</span>
                  <span className="text-[13px] text-white capitalize">{value}</span>
                </div>
              ))}
              <Button variant="secondary" size="md" onClick={() => setEditing(true)}>Edit profile</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
