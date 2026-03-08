import React from 'react';

export function ShimmerBlock({ className = '' }: { className?: string }) {
  return <div className={`shimmer rounded-2xl ${className}`} />;
}
export function ShimmerCircle({ className = '' }: { className?: string }) {
  return <div className={`shimmer rounded-full ${className}`} />;
}
export function DashboardSkeleton() {
  return (
    <div className="px-4 pt-14 pb-4 max-w-lg mx-auto space-y-4">
      <div className="flex justify-between mb-6"><div><ShimmerBlock className="h-7 w-48 mb-2" /><ShimmerBlock className="h-4 w-32" /></div><ShimmerCircle className="w-10 h-10" /></div>
      <div className="glass rounded-3xl p-6"><div className="flex justify-center mb-4"><ShimmerCircle className="w-44 h-44" /></div><div className="grid grid-cols-2 gap-3"><ShimmerBlock className="h-14" /><ShimmerBlock className="h-14" /><ShimmerBlock className="h-14" /><ShimmerBlock className="h-14" /></div></div>
      <ShimmerBlock className="h-24" /><ShimmerBlock className="h-24" />
    </div>
  );
}
