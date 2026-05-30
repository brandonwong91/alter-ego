import type { HTMLAttributes } from 'react'

import { cn } from '../../lib/cn'

export function Section(
  props: HTMLAttributes<HTMLElement> & { as?: 'section' | 'div' },
) {
  const { className, as = 'section', ...rest } = props
  const Comp = as
  return (
    <Comp
      className={cn('relative py-20 sm:py-24 lg:py-28', className)}
      {...rest}
    />
  )
}

