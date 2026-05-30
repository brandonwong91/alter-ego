import { useParallax } from '../../hooks/useParallax'

export function Atmosphere() {
  const driftA = useParallax(0.06)
  const driftB = useParallax(0.035)
  const driftC = useParallax(0.02)

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-fog-1" />
      <div
        className="absolute -left-[18%] top-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(215,200,241,0.72),rgba(215,200,241,0)_62%)] blur-2xl"
        style={{ transform: `translate3d(0, ${-driftA}px, 0)` }}
      />
      <div
        className="absolute -right-[16%] top-[6%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,214,191,0.62),rgba(255,214,191,0)_65%)] blur-2xl"
        style={{ transform: `translate3d(0, ${-driftB}px, 0)` }}
      />
      <div
        className="absolute left-[14%] bottom-[-14%] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle_at_45%_45%,rgba(167,185,170,0.42),rgba(167,185,170,0)_62%)] blur-2xl"
        style={{ transform: `translate3d(0, ${-driftC}px, 0)` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,16,28,0.18),rgba(20,16,28,0)_55%)]" />
    </div>
  )
}
