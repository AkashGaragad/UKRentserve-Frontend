export function CardSkeleton({ type = 'standard' }) {
  if (type === 'professional') {
    return (
      <div className="bg-white dark:bg-[#131b38] border border-gray-200/80 dark:border-[#2a3768] rounded-2xl p-5 animate-pulse flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700/60" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700/60 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700/60 rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-3.5 bg-gray-200 dark:bg-gray-700/60 rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700/60 rounded w-2/3" />
          </div>
        </div>
        <div className="pt-3 border-t border-gray-100 dark:border-[#2a3768] flex items-center justify-between">
          <div className="h-5 bg-gray-200 dark:bg-gray-700/60 rounded w-20" />
          <div className="h-9 bg-gray-200 dark:bg-gray-700/60 rounded-xl w-24" />
        </div>
      </div>
    );
  }

  if (type === 'vehicle') {
    return (
      <div className="bg-white dark:bg-[#131b38] border border-gray-200/80 dark:border-[#2a3768] rounded-2xl p-4 animate-pulse flex items-center gap-4">
        <div className="w-20 h-16 rounded-xl bg-gray-200 dark:bg-gray-700/60 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700/60 rounded w-1/2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700/60 rounded w-1/3" />
        </div>
        <div className="h-9 bg-gray-200 dark:bg-gray-700/60 rounded-xl w-24" />
      </div>
    );
  }

  // Accommodation default skeleton
  return (
    <div className="bg-white dark:bg-[#131b38] border border-gray-200/80 dark:border-[#2a3768] rounded-2xl overflow-hidden animate-pulse flex flex-col">
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700/60" />
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-3 bg-gray-200 dark:bg-gray-700/60 rounded w-20" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700/60 rounded-full w-12" />
          </div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700/60 rounded w-4/5" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700/60 rounded w-1/2" />
        </div>
        <div className="pt-3 border-t border-gray-100 dark:border-[#2a3768] flex items-center justify-between">
          <div className="h-5 bg-gray-200 dark:bg-gray-700/60 rounded w-24" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700/60 rounded-lg w-20" />
        </div>
      </div>
    </div>
  );
}
