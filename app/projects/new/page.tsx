"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Sparkles, Loader2 } from "lucide-react";
import { useAppStore } from "@/store";
import { AppNav } from "@/components/navigation/app-nav";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ProjectType } from "@/types";
import { generateProjectStructure } from "@/lib/services/ai-service";

const PROJECT_TYPES: { id: ProjectType; label: string; desc: string }[] = [
  { id: "website", label: "Website", desc: "Marketing or informational site" },
  { id: "web-app", label: "Web Application", desc: "Interactive browser-based app" },
  { id: "mobile-app", label: "Mobile App", desc: "iOS or Android application" },
  { id: "ecommerce", label: "E-commerce", desc: "Online store or marketplace" },
  { id: "saas", label: "SaaS Product", desc: "Software as a service platform" },
  { id: "other", label: "Other", desc: "Something unique" },
];

const EXAMPLE_PROMPTS = [
  "An online learning platform where students can purchase courses, watch video lessons, and track their progress.",
  "A marketplace where local service providers can list their services and customers can book appointments.",
  "A project management tool for remote teams with kanban boards, time tracking, and client reporting.",
];

const GENERATION_STEPS = [
  "Analyzing your project description...",
  "Identifying user types and roles...",
  "Extracting major features...",
  "Organizing application pages...",
  "Connecting workflows...",
  "Finalizing project structure...",
];

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useAppStore((s) => s.createProject);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", description: "", type: "web-app" as ProjectType,
    idea: "", audience: "", problem: "", objective: "",
  });
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 1) return form.name.trim().length > 0;
    if (step === 2) return form.idea.trim().length > 20;
    if (step === 3) return form.audience.trim().length > 0;
    return true;
  };

  const handleGenerate = async () => {
    setGenerating(true);
    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      setGenStep(i);
      await new Promise((r) => setTimeout(r, 600));
    }
    const structure = generateProjectStructure(form.idea, form.type);
    const project = createProject({
      name: form.name,
      description: form.description || form.idea.slice(0, 120),
      type: form.type,
      audience: form.audience,
      objective: form.objective,
      nodes: structure.nodes,
      edges: structure.edges,
    });
    toast.success("Project structure generated!");
    router.push(`/projects/${project.id}/editor`);
  };

  return (
    <div className="min-h-screen bg-[#090909]">
      <AppNav />
      <main className="max-w-[680px] mx-auto px-6 py-12">
        {/* Back */}
        <Link href="/projects" className="inline-flex items-center gap-2 text-[13px] text-[#555] hover:text-white transition-colors mb-8">
          <ArrowLeft size={14} /> Back to projects
        </Link>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-10">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold transition-all",
                s < step ? "bg-[#22c55e] text-black" :
                s === step ? "bg-white text-black" :
                "bg-[#141414] border border-[#262626] text-[#555]"
              )}>
                {s < step ? <Check size={12} /> : s}
              </div>
              {s < 4 && <div className={cn("flex-1 h-px w-12", s < step ? "bg-[#22c55e]/40" : "bg-[#1a1a1a]")} />}
            </div>
          ))}
        </div>

        {/* Step 1: Project details */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h1 className="text-[28px] font-semibold text-white tracking-tight mb-1">Project details</h1>
            <p className="text-[15px] text-[#555] mb-8">Give your project a name and choose its type.</p>
            <div className="space-y-5">
              <Input label="Project name" placeholder="e.g. EduFlow, MarketHub, TaskFlow" value={form.name} onChange={(e) => set("name", e.target.value)} />
              <Textarea label="Short description (optional)" placeholder="A brief summary of what you're building..." value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
              <div>
                <p className="text-[13px] font-medium text-[#999] mb-2">Project type</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PROJECT_TYPES.map((t) => (
                    <button key={t.id} type="button" onClick={() => set("type", t.id)}
                      className={cn("flex flex-col items-start p-3 rounded-[10px] border text-left transition-all",
                        form.type === t.id ? "bg-[#1c1c1c] border-[#0099ff]/40 ring-1 ring-[#0099ff]/20" : "bg-[#141414] border-[#262626] hover:border-[#333]")}>
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[13px] font-medium text-white">{t.label}</span>
                        {form.type === t.id && <Check size={11} className="text-[#0099ff]" />}
                      </div>
                      <span className="text-[11px] text-[#555]">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Describe idea */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="text-[28px] font-semibold text-white tracking-tight mb-1">Describe your idea</h1>
            <p className="text-[15px] text-[#555] mb-8">Don't worry about technical details. Just explain what you want to build.</p>
            <Textarea
              label="Your project idea"
              placeholder="Describe what you want to build. Don't worry about technical details. Just explain your idea in your own words."
              value={form.idea}
              onChange={(e) => set("idea", e.target.value)}
              rows={8}
              hint={`${form.idea.length} characters`}
            />
            <div className="mt-4">
              <p className="text-[12px] text-[#555] mb-2">Example prompts:</p>
              <div className="space-y-2">
                {EXAMPLE_PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => set("idea", p)}
                    className="w-full text-left px-3 py-2.5 rounded-[10px] bg-[#141414] border border-[#262626] hover:border-[#333] text-[13px] text-[#555] hover:text-white transition-all">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Audience */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h1 className="text-[28px] font-semibold text-white tracking-tight mb-1">Project audience</h1>
            <p className="text-[15px] text-[#555] mb-8">Help us understand who this is for.</p>
            <div className="space-y-5">
              <Input label="Who will use this application?" placeholder="e.g. Students aged 18–35 and professional instructors" value={form.audience} onChange={(e) => set("audience", e.target.value)} />
              <Input label="What problem should it solve?" placeholder="e.g. Students can't find affordable, structured online courses" value={form.problem} onChange={(e) => set("problem", e.target.value)} />
              <Input label="What is the primary objective?" placeholder="e.g. Help students learn new skills and advance their careers" value={form.objective} onChange={(e) => set("objective", e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h1 className="text-[28px] font-semibold text-white tracking-tight mb-1">Review your project</h1>
            <p className="text-[15px] text-[#555] mb-8">Everything looks good? Generate your visual project structure.</p>
            <div className="space-y-3 mb-8">
              {[
                { label: "Project name", value: form.name },
                { label: "Type", value: PROJECT_TYPES.find((t) => t.id === form.type)?.label },
                { label: "Description", value: form.description || "—" },
                { label: "Idea", value: form.idea },
                { label: "Audience", value: form.audience || "—" },
                { label: "Objective", value: form.objective || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#141414] border border-[#262626] rounded-[12px] p-4">
                  <p className="text-[12px] text-[#555] mb-1">{label}</p>
                  <p className="text-[14px] text-white leading-relaxed">{value}</p>
                </div>
              ))}
            </div>

            {generating ? (
              <div className="bg-[#141414] border border-[#262626] rounded-[20px] p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[#6a4cf5]/20 flex items-center justify-center mx-auto mb-4">
                  <Loader2 size={20} className="text-[#6a4cf5] animate-spin" />
                </div>
                <p className="text-[15px] font-medium text-white mb-2">Generating project structure</p>
                <p className="text-[13px] text-[#555]">{GENERATION_STEPS[genStep]}</p>
                <div className="mt-4 bg-[#1c1c1c] rounded-full h-1 overflow-hidden">
                  <div
                    className="h-full bg-[#6a4cf5] transition-all duration-500 rounded-full"
                    style={{ width: `${((genStep + 1) / GENERATION_STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <Button variant="primary" size="lg" className="w-full gap-2" onClick={handleGenerate}>
                <Sparkles size={16} /> Generate project structure
              </Button>
            )}
          </div>
        )}

        {/* Navigation */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-8">
            <Button variant="ghost" size="md" onClick={() => setStep(step - 1)} disabled={step === 1}>
              <ArrowLeft size={14} /> Back
            </Button>
            <Button variant="primary" size="md" onClick={() => setStep(step + 1)} disabled={!canNext()}>
              Continue <ArrowRight size={14} />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
