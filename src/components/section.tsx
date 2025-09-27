import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  title: string;
  className?: string;
  children?: ReactNode;
};

export const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ id, title, className, children }, ref) => {
    return (
      <section
        id={id}
        ref={ref}
        data-section-id={id}
        className={cn("scroll-mt-24", className)}
      >
        <h2 className="text-2xl font-semibold mb-3">{title}</h2>
        <div className="prose prose-slate max-w-none">{children}</div>
      </section>
    );
  }
);

Section.displayName = "Section";