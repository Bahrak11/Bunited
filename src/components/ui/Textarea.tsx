import { cn } from "@/lib/utils";
import { forwardRef, TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none",
            error && "border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
