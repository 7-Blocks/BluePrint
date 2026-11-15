"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    login(email, email.split("@")[0]);
    toast.success("Welcome back!");
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
        <div className="w-full max-w-[400px]">
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
          <h1 className="text-[28px] font-semibold text-white tracking-tight mb-1">Welcome back</h1>
          <p className="text-[15px] text-[#555] mb-8">Sign in to your workspace</p>
          <button className="w-full flex items-center justify-center gap-3 bg-[#141414] border border-[#262626] rounded-full py-2.5 text-[14px] font-medium text-white hover:bg-[#1c1c1c] transition-colors mb-4">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#1a1a1a]" />
            <span className="text-[12px] text-[#333]">or</span>
            <div className="flex-1 h-px bg-[#1a1a1a]" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input label="Email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} autoComplete="email" />
            <div className="relative">
              <Input label="Password" type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} autoComplete="current-password" />
              <button type="button" className="absolute right-3 top-8 text-[#555] hover:text-white transition-colors" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Hide password" : "Show password"}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded bg-[#141414] border border-[#262626] accent-[#0099ff]" />
                <span className="text-[13px] text-[#999]">Remember me</span>
              </label>
              <a href="#" className="text-[13px] text-[#0099ff] hover:underline">Forgot password?</a>
            </div>
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">Sign in</Button>
          </form>
          <p className="text-center text-[14px] text-[#555] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#0099ff] hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
