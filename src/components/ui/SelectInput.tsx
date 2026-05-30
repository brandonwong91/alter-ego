import type { SelectHTMLAttributes } from 'react'

import { cn } from '../../lib/cn'

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, children, ...rest } = props
  return (
    <select
      className={cn(
        'h-11 w-full appearance-none rounded-2xl border border-white/18 bg-white/10 px-4 pr-10 text-[14px] text-ink-1',
        'outline-none backdrop-blur-xl transition',
        'focus-visible:border-lilac-2/60 focus-visible:ring-2 focus-visible:ring-lilac-2/30',
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  )
}

