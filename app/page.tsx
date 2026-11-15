"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight, Check, ChevronDown, Zap, GitBranch, Users, MessageSquare,
  History, CheckCircle, Share2, Layout, Plus, Minus
} from "lucide-react";
import { LandingNav } from "@/components/landing/nav";
import { HeroPreview } from "@/components/landing/hero-preview";
import { InteractiveDemo } from "@/components/landing/interactive-demo";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { icon: Zap, title: "AI-Assisted Structuring", desc: "Describe your idea in plain English. Our AI extracts pages, features, and workflows automatically.", color: "#6a4cf5" },
  { icon: Layout, title: "Visual Page Mapping", desc: "See your entire project as an interactive map. Understand how every page connects.", color: "#0099ff" },
  { icon: GitBranch, title: "Connected Workflows", desc: "Draw relationships between features. Show clients exactly how things work together.", color: "#d44df0" },
  { icon: Users, title: "Client Collaboration", desc: "Share a beautiful, client-friendly view. No technical knowledge required.", color: "#22c55e" },
  { icon: MessageSquare, title: "Contextual Comments", desc: "Clients leave feedback directly on specific features. No more confusing email threads.", color: "#ff7a3d" },
  { icon: History, title: "Version Comparison", desc: "Track every change. Compare versions side-by-side with visual diff highlighting.", color: "#ff5577" },
  { icon: CheckCircle, title: "Scope Approval", desc: "Get formal sign-off on the project scope before development begins.", color: "#22c55e" },
  { icon: Share2, title: "Shareable Links", desc: "Generate a shareable link for any project. Control who can view and comment.", color: "#0099ff" },
];

const STEPS = [
  { num: "01", title: "Describe your idea", desc: "Write what you want to build in plain English. No technical jargon needed." },
  { num: "02", title: "Structure requirements", desc: "AI identifies pages, features, user roles, and workflows from your description." },
  { num: "03", title: "Build your visual map", desc: "Drag, connect, and organize your project structure on an interactive canvas." },
  { num: "04", title: "Share and approve", desc: "Send a beautiful project plan to your client. Collect feedback and get sign-off." },
];

const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect for trying Blueprint",
    features: ["2 active projects", "Basic visual editor", "Limited sharing (3 views)", "Community support"],
    cta: "Start for free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    desc: "For freelancers and independent developers",
    features: ["Unlimited projects", "AI-assisted structuring", "Advanced visual editing", "Version history", "Client collaboration", "Priority support"],
    cta: "Start Pro trial",
    featured: true,
  },
  {
    name: "Agency",
    price: "$79",
    period: "per month",
    desc: "For teams and agencies",
    features: ["Everything in Pro", "Multiple workspaces", "Team collaboration", "Advanced approval workflows", "Branded client sharing", "Dedicated support"],
    cta: "Contact sales",
    featured: false,
  },
];

const FAQS = [
  { q: "What is project scoping?", a: "Project scoping is the process of defining exactly what will be built before development starts. It includes pages, features, user roles, and workflows — everything a developer needs to give an accurate estimate." },
  { q: "Do clients need technical knowledge to use Blueprint?", a: "No. The client-facing view uses plain English throughout. Clients see a visual map of their project and can leave comments without understanding any technical concepts." },
  { q: "How does the AI structuring work?", a: "You describe your project idea in plain English. Our AI analyzes the description and extracts pages, features, user roles, and workflows. You can then edit, accept, or reject each suggestion." },
  { q: "Can I share a project without requiring a login?", a: "Yes. You can generate a shareable link that anyone can view without creating an account. You control whether viewers can leave comments." },
  { q: "What happens after the client approves the scope?", a: "The approved scope is locked as a reference document. Both parties can refer back to it throughout development to prevent scope creep." },
  { q: "Is there a free trial for paid plans?", a: "Yes. Pro and Agency plans include a 14-day free trial with no credit card required." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#1a1a1a] last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-[15px] font-medium text-white">{q}</span>
        <span className="flex-shrink-0 text-[#555]">{open ? <Minus size={16} /> : <Plus size={16} />}</span>
      </button>
      {open && <p className="text-[15px] text-[#999] leading-relaxed pb-5">{a}</p>}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#090909]">
      <LandingNav />

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <h1 className="text-[56px] sm:text-[72px] lg:text-[88px] font-semibold text-white leading-[0.95] tracking-[-4px] mb-6 max-w-[800px]">
              Turn ideas into projects everyone understands.
            </h1>
            <p className="text-[18px] text-[#999] leading-relaxed max-w-[520px] mb-10">
              Transform scattered client requirements into beautiful visual project plans. Organize features, connect workflows, and get everyone on the same page.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link href="/signup">
                <Button variant="primary" size="lg" className="gap-2">
                  Start planning for free <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/projects/proj-eduflow/review">
                <Button variant="secondary" size="lg">Explore an example</Button>
              </Link>
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      {/* Problem section */}
      <section className="py-24 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[42px] sm:text-[56px] font-semibold text-white tracking-[-2.5px] leading-tight mb-4">
              The old way doesn't work.
            </h2>
            <p className="text-[17px] text-[#999] max-w-[480px] mx-auto">
              Vague requirements lead to missed deadlines, scope creep, and frustrated clients.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Traditional */}
            <div className="bg-[#141414] border border-[#262626] rounded-[20px] p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                <span className="text-[12px] font-medium text-red-400">Traditional process</span>
              </div>
              <div className="space-y-3">
                {["Endless back-and-forth messages", "Confusing Word documents", "Unclear requirements", "Repeated revisions", "Scope creep", "Missed deadlines"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] text-red-400">✕</span>
                    </div>
                    <span className="text-[15px] text-[#999]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Blueprint */}
            <div className="bg-[#6a4cf5]/10 border border-[#6a4cf5]/20 rounded-[20px] p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6a4cf5]/20 border border-[#6a4cf5]/30 mb-6">
                <span className="text-[12px] font-medium text-[#a78bfa]">With Blueprint</span>
              </div>
              <div className="space-y-3">
                {["Structured visual requirements", "Interactive project maps", "Clear feature definitions", "Organized client feedback", "Approved scope document", "Everyone aligned from day one"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center flex-shrink-0">
                      <Check size={10} className="text-[#22c55e]" />
                    </div>
                    <span className="text-[15px] text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[42px] sm:text-[56px] font-semibold text-white tracking-[-2.5px] leading-tight mb-4">
              How it works
            </h2>
            <p className="text-[17px] text-[#999] max-w-[400px] mx-auto">
              From scattered idea to approved project plan in four steps.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative bg-[#141414] border border-[#262626] rounded-[20px] p-6">
                <div className="text-[42px] font-semibold text-[#1c1c1c] tracking-tight mb-4">{step.num}</div>
                <h3 className="text-[17px] font-semibold text-white mb-2 tracking-tight">{step.title}</h3>
                <p className="text-[14px] text-[#999] leading-relaxed">{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 -translate-y-1/2 z-10">
                    <ArrowRight size={16} className="text-[#333]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[42px] sm:text-[56px] font-semibold text-white tracking-[-2.5px] leading-tight mb-4">
              Everything you need to scope a project.
            </h2>
            <p className="text-[17px] text-[#999] max-w-[480px] mx-auto">
              Built for developers and agencies who want to communicate clearly with clients.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              const isSpotlight = i === 1 || i === 5;
              return (
                <div
                  key={f.title}
                  className={`rounded-[20px] p-6 border ${isSpotlight ? "border-transparent" : "bg-[#141414] border-[#262626]"}`}
                  style={isSpotlight ? { background: f.color, borderColor: "transparent" } : {}}
                >
                  <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center mb-4 ${isSpotlight ? "bg-white/20" : "bg-[#1c1c1c]"}`}>
                    <Icon size={18} style={{ color: isSpotlight ? "white" : f.color }} />
                  </div>
                  <h3 className="text-[15px] font-semibold text-white mb-2">{f.title}</h3>
                  <p className={`text-[13px] leading-relaxed ${isSpotlight ? "text-white/80" : "text-[#999]"}`}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-24 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[42px] sm:text-[56px] font-semibold text-white tracking-[-2.5px] leading-tight mb-4">
              Explore a live project.
            </h2>
            <p className="text-[17px] text-[#999] max-w-[400px] mx-auto">
              Click any block to understand how a real project is structured.
            </p>
          </div>
          <div className="bg-[#141414] border border-[#262626] rounded-[20px] p-8">
            <InteractiveDemo />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[42px] sm:text-[56px] font-semibold text-white tracking-[-2.5px] leading-tight mb-4">
              Simple, honest pricing.
            </h2>
            <p className="text-[17px] text-[#999] max-w-[400px] mx-auto">
              Start free. Upgrade when you need more.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-[20px] p-6 border flex flex-col ${
                  plan.featured ? "bg-[#1c1c1c] border-[#6a4cf5]/40" : "bg-[#141414] border-[#262626]"
                }`}
              >
                {plan.featured && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6a4cf5]/20 border border-[#6a4cf5]/30 mb-4 self-start">
                    <span className="text-[11px] font-medium text-[#a78bfa]">Most popular</span>
                  </div>
                )}
                <h3 className="text-[22px] font-semibold text-white mb-1">{plan.name}</h3>
                <p className="text-[13px] text-[#555] mb-4">{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-[42px] font-semibold text-white tracking-tight">{plan.price}</span>
                  <span className="text-[14px] text-[#555]">/{plan.period}</span>
                </div>
                <div className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <Check size={14} className="text-[#22c55e] flex-shrink-0" />
                      <span className="text-[14px] text-[#999]">{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/signup">
                  <Button variant={plan.featured ? "primary" : "secondary"} size="md" className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-[720px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[42px] sm:text-[56px] font-semibold text-white tracking-[-2.5px] leading-tight mb-4">
              Common questions.
            </h2>
          </div>
          <div className="bg-[#141414] border border-[#262626] rounded-[20px] px-6">
            {FAQS.map((faq) => <FAQItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-[#6a4cf5] rounded-[30px] p-12 text-center">
            <h2 className="text-[42px] sm:text-[56px] font-semibold text-white tracking-[-2.5px] leading-tight mb-4">
              Ready to scope your next project?
            </h2>
            <p className="text-[17px] text-white/80 max-w-[400px] mx-auto mb-8">
              Join developers and agencies who use Blueprint to communicate clearly with clients.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signup">
                <Button variant="primary" size="lg" className="gap-2">
                  Start for free <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/projects/proj-eduflow/review">
                <Button size="lg" className="bg-white/20 text-white hover:bg-white/30 rounded-full border-0">
                  See a live example
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-[8px] bg-white flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="5" height="5" rx="1" fill="#090909" />
                    <rect x="9" y="2" width="5" height="5" rx="1" fill="#090909" />
                    <rect x="2" y="9" width="5" height="5" rx="1" fill="#090909" />
                    <rect x="9" y="9" width="5" height="5" rx="1" fill="#090909" opacity="0.4" />
                  </svg>
                </div>
                <span className="text-[15px] font-semibold text-white">Blueprint</span>
              </div>
              <p className="text-[13px] text-[#555] leading-relaxed">From scattered ideas to crystal-clear project plans.</p>
            </div>
            {[
              { title: "Product", links: ["Features", "How it works", "Pricing", "Changelog"] },
              { title: "Resources", links: ["Documentation", "Templates", "Blog", "Support"] },
              { title: "Company", links: ["About", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Cookies"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-[13px] font-medium text-white mb-3">{col.title}</h4>
                <div className="space-y-2">
                  {col.links.map((l) => (
                    <a key={l} href="#" className="block text-[13px] text-[#555] hover:text-[#999] transition-colors">{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-[#1a1a1a] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-[#555]">© 2025 Blueprint. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {["Twitter", "GitHub", "LinkedIn"].map((s) => (
                <a key={s} href="#" className="text-[12px] text-[#555] hover:text-[#999] transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
