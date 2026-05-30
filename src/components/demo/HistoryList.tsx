import type { Archetype, Country, Era } from '../../data/demo'

import { cn } from '../../lib/cn'

export type DemoRun = {
  id: string
  createdAt: number
  seed: string
  country: Country
  era: Era
  choiceValues: Record<'c1' | 'c2' | 'c3', 'a' | 'b'>
  archetype: Archetype
}

function formatTime(ms: number) {
  const d = new Date(ms)
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function HistoryList(props: {
  runs: DemoRun[]
  activeRunId?: string
  onSelect: (run: DemoRun) => void
  onClear: () => void
}) {
  const { runs, activeRunId, onSelect, onClear } = props

  return (
    <div className="rounded-[26px] border border-white/14 bg-white/8 p-5 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[12px] uppercase tracking-[0.22em] text-ink-3">
            Run history
          </div>
          <div className="mt-1 text-[14px] leading-[1.6] text-ink-2">
            Saved locally on this device.
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[12px] uppercase tracking-[0.2em] text-ink-2 transition hover:bg-white/12 hover:border-white/18"
        >
          Clear
        </button>
      </div>

      {runs.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-white/12 bg-white/6 px-4 py-4 text-[14px] leading-[1.7] text-ink-2">
          No runs yet. Reveal an Alter Ego to start building a history.
        </div>
      ) : (
        <div className="mt-5 grid gap-2">
          {runs.map((run) => (
            <button
              key={run.id}
              type="button"
              onClick={() => onSelect(run)}
              className={cn(
                'flex w-full items-start justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition',
                run.id === activeRunId
                  ? 'border-lilac-2/45 bg-white/14'
                  : 'border-white/12 bg-white/6 hover:bg-white/10 hover:border-white/18',
              )}
            >
              <div>
                <div className="text-[13px] leading-[1.5] text-ink-1">
                  {run.archetype}
                </div>
                <div className="mt-1 text-[12px] uppercase tracking-[0.2em] text-ink-3">
                  {run.country} · {run.era}
                </div>
              </div>
              <div className="text-[12px] text-ink-3">{formatTime(run.createdAt)}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

