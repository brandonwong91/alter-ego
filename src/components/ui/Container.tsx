import type { HTMLAttributes } from 'react'

import { cn } from '../../lib/cn'

export function Container(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props
  return (
    <div
      className={cn('mx-auto w-full max-w-[1120px] px-6 lg:px-8', className)}
      {...rest}
    />
  )
}

