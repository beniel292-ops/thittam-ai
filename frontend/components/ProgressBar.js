"use client";

export default function ProgressBar({ current, total }) {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="mb-6">
      <div className="h-2 w-full overflow-hidden rounded-full bg-primary-100">
        <div
          className="h-full rounded-full bg-primary-600 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs text-gray-500">{current}/{total}</p>
    </div>
  );
}
