export default function Loader({ count = 3 }: { count?: number }) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col glass-card rounded-3xl overflow-hidden animate-pulse border border-white/5 h-full min-h-[300px]">
          <div className="h-48 w-full bg-white/5" />
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-6 w-2/3 bg-white/5 rounded-md" />
              <div className="h-6 w-12 bg-white/5 rounded-full" />
            </div>
            <div className="h-4 w-1/2 bg-white/5 rounded-md" />
            <div className="pt-4 border-t border-border/50 flex justify-between">
              <div className="h-4 w-1/4 bg-white/5 rounded-md" />
              <div className="h-4 w-1/4 bg-white/5 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}