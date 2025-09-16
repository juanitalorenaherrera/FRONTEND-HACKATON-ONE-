// src/components/ui/Skeleton.tsx

import * as React from 'react';

import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-neutral-200/80', className)}
      {...props}
    />
  );
}

export { Skeleton };