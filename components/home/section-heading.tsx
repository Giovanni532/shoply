import { cn } from "@/lib/utils"

export function SectionHeading({ eyebrow, title, lede, className, children }: { eyebrow: string; title: string; lede?: string; className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-12 md:items-end", className)}>
      <div className="md:col-span-7">
        <p className="eyebrow text-beam-ink">{eyebrow}</p>
        <h2 className="display mt-4 text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.95]">{title}</h2>
      </div>
      <div className="flex flex-col gap-5 md:col-span-5 md:items-start">
        {lede && <p className="max-w-md text-[17px] leading-relaxed text-muted-foreground">{lede}</p>}
        {children}
      </div>
    </div>
  )
}
