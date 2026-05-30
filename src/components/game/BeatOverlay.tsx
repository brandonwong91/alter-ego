import { cn } from '../../lib/cn'

export function BeatOverlay(props: { open: boolean; title: string; text: string }) {
  const { open, title, text } = props
  return (
    <div
      aria-hidden={!open}
      className={cn(
        'pointer-events-none fixed inset-0 z-50 grid place-items-center transition',
        open ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div className="absolute inset-0 bg-ink-1/20 backdrop-blur-md" />
      <div
        className={cn(
          'relative mx-auto w-[min(640px,calc(100%-48px))] rounded-[30px] border border-white/16 bg-white/10 p-6 shadow-bloom backdrop-blur-2xl',
          open ? 'animate-reveal-up' : null,
        )}
      >
        <div className="text-[12px] uppercase tracking-[0.22em] text-ink-3">{title}</div>
        <div className="mt-3 font-display text-[28px] leading-[1.08] tracking-[-0.03em] text-ink-1">
          Consequence
        </div>
        <div className="mt-3 whitespace-pre-line text-[15px] leading-[1.85] text-ink-2">
          {text}
        </div>
      </div>
    </div>
  )
}

