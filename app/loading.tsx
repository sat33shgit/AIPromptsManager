export default function Loading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-64 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]" />
      ))}
    </div>
  );
}
