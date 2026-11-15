"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ACCOUNT_TYPES = [
  { id: "freelancer", label: "Freelancer", desc: "Independent developer or designer" },
  { id: "agency", label: "Agency", desc: "Team of developers or designers" },
  { id: "developer", label: "Developer", desc: "In-house or employed developer" },
  { id: "other", label: "Other", desc: "Something else entirely" },
] as const;

export default function SignupPage() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [accountType, setAccountType] = useState<string>("freelancer");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    login(form.email, form.name);
    toast.success("Account created! Welcome to Blueprint.");
    router.push("/projects");
  };

  return (
    <div className="min-h-screen bg-[#090909] flex flex-col">
      <div className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-[#555] hover:text-white transition-colors">
          <ArrowLeft size={14} /> Back to home
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[440px]">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-[9px] bg-white flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1" fill="#090909" />
                <rect x="9" y="2" width="5" height="5" rx="1" fill="#090909" />
                <rect x="2" y="9" width="5" height="5" rx="1" fill="#090909" />
                <rect x="9" y="9" width="5" height="5" rx="1" fill="#090909" opacity="0.4" />
              </svg>
            </div>
            <span className="text-[16px] font-semibold text-white">Blueprint</span>
          </div>
          <h1 className="text-[28px] font-semibold text-white tracking-tight mb-1">Create your account</h1>
          <p className="text-[15px] text-[#555] mb-8">Start scoping projects in minutes</p>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input label="Full name" placeholder="Alex Rivera" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} autoComplete="name" />
            <Input label="Work email" type="email" placeholder="you@company.com" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} autoComplete="email" />
            <div className="relative">
              <Input label="Password" type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={form.password} onChange={(e) => set("password", e.target.value)} error={errors.password} autoComplete="new-password" />
              <button type="button" className="absolute right-3 top-8 text-[#555] hover:text-white transition-colors" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Input label="Confirm password" type="password" placeholder="Repeat password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} error={errors.confirm} autoComplete="new-password" />
            <div>
              <p className="text-[13px] font-medium text-[#999] mb-2">I am a</p>
              <div className="grid grid-cols-2 gap-2">
                {ACCOUNT_TYPES.map((t) => (
                  <button key={t.id} type="button" onClick={() => setAccountType(t.id)}
                    className={cn("flex flex-col items-start p-3 rounded-[10px] border text-left transition-all",
                      accountType === t.id ? "bg-[#1c1c1c] border-[#0099ff]/40 ring-1 ring-[#0099ff]/20" : "bg-[#141414] border-[#262626] hover:border-[#333]")}>
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-[13px] font-medium text-white">{t.label}</span>
                      {accountType === t.id && <Check size={12} className="text-[#0099ff]" />}
                    </div>
                    <span className="text-[11px] text-[#555]">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">Create account</Button>
          </form>
          <p className="text-center text-[13px] text-[#555] mt-4">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-[#0099ff] hover:underline">Terms</a> and{" "}
            <a href="#" className="text-[#0099ff] hover:underline">Privacy Policy</a>.
          </p>
          <p className="text-center text-[14px] text-[#555] mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0099ff] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
