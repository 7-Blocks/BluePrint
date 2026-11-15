"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[13px] font-medium text-[#999]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-[#141414] text-white text-[15px] rounded-[10px] px-3.5 py-2.5 border border-[#262626] placeholder:text-[#555] transition-all duration-150",
            "focus:outline-none focus:border-[#0099ff] focus:ring-1 focus:ring-[#0099ff]/20",
            error && "border-red-500/50 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-[12px] text-red-400">{error}</p>}
        {hint && !error && <p className="text-[12px] text-[#555]">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[13px] font-medium text-[#999]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-[#141414] text-white text-[15px] rounded-[10px] px-3.5 py-2.5 border border-[#262626] placeholder:text-[#555] transition-all duration-150 resize-none",
            "focus:outline-none focus:border-[#0099ff] focus:ring-1 focus:ring-[#0099ff]/20",
            error && "border-red-500/50",
            className
          )}
          {...props}
        />
        {error && <p className="text-[12px] text-red-400">{error}</p>}
        {hint && !error && <p className="text-[12px] text-[#555]">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Input, Textarea };
