import { cn } from '../../lib/cn'

export function ChoiceRow(props: {
  index: number
  prompt: string
  a: string
  b: string
  value: 'a' | 'b'
  onChange: (value: 'a' | 'b') => void
  tone?: 'light' | 'dark'
}) {
  const { index, prompt, a, b, value, onChange, tone = 'light' } = props
  const isDark = tone === 'dark'
  return (
    <div className="rounded-[22px] border border-white/14 bg-white/8 p-5 backdrop-blur-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div
            className={cn(
              'text-[12px] uppercase tracking-[0.22em]',
              isDark ? 'text-white/70' : 'text-ink-3',
            )}
          >
            Choice {index}
          </div>
          <div
            className={cn(
              'mt-2 text-[15px] leading-[1.7]',
              isDark ? 'text-white' : 'text-ink-1',
            )}
          >
            {prompt}
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onChange('a')}
          className={cn(
            'rounded-2xl border px-4 py-3 text-left text-[14px] leading-[1.6] transition backdrop-blur-xl',
            value === 'a'
              ? 'border-lilac-2/50 bg-white/16 shadow-glass'
              : 'border-white/12 bg-white/8 hover:bg-white/12 hover:border-white/18',
          )}
        >
          <div
            className={cn(
              'text-[12px] uppercase tracking-[0.22em]',
              isDark ? 'text-white/65' : 'text-ink-3',
            )}
          >
            A
          </div>
          <div className={cn('mt-1', isDark ? 'text-white' : 'text-ink-1')}>
            {a}
          </div>
        </button>
        <button
          type="button"
          onClick={() => onChange('b')}
          className={cn(
            'rounded-2xl border px-4 py-3 text-left text-[14px] leading-[1.6] transition backdrop-blur-xl',
            value === 'b'
              ? 'border-apricot-2/55 bg-white/16 shadow-glass'
              : 'border-white/12 bg-white/8 hover:bg-white/12 hover:border-white/18',
          )}
        >
          <div
            className={cn(
              'text-[12px] uppercase tracking-[0.22em]',
              isDark ? 'text-white/65' : 'text-ink-3',
            )}
          >
            B
          </div>
          <div className={cn('mt-1', isDark ? 'text-white' : 'text-ink-1')}>
            {b}
          </div>
        </button>
      </div>
    </div>
  )
}
