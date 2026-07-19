"use client";

/**
 * Renders one wizard question. Three input styles, all tap-only:
 * - "options": single-select grid of big buttons (auto-advances)
 * - "multi":   multi-select chips + a "none" chip
 * - "stepper": large number with -10/-1/+1/+10 buttons (for age)
 */

import { useLanguage } from "@/lib/i18n";

export default function QuestionStep({ question, value, onSelect, onToggle }) {
  const { t } = useLanguage();

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold">{t(question.titleKey)}</h2>
      {question.hintKey ? (
        <p className="mb-4 text-sm text-gray-600">{t(question.hintKey)}</p>
      ) : (
        <div className="mb-4" />
      )}

      {question.type === "stepper" && (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="text-6xl font-extrabold text-primary-700" aria-live="polite">
            {value}
          </div>
          <div className="text-sm text-gray-500">{t("years")}</div>
          <div className="grid w-full grid-cols-4 gap-2">
            {[-10, -1, +1, +10].map((delta) => (
              <button
                key={delta}
                type="button"
                onClick={() => onSelect(clamp(value + delta, question.min, question.max))}
                className="rounded-xl border border-primary-100 bg-white py-4 text-lg font-bold text-primary-700 active:bg-primary-100"
              >
                {delta > 0 ? `+${delta}` : delta}
              </button>
            ))}
          </div>
        </div>
      )}

      {question.type === "options" && (
        <div className="grid grid-cols-1 gap-2">
          {question.options.map((option) => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onSelect(option.value)}
              className={`rounded-xl border px-4 py-4 text-left text-base font-semibold transition-colors ${
                value === option.value
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border-primary-100 bg-white text-gray-800 active:bg-primary-100"
              }`}
            >
              {t(option.labelKey)}
            </button>
          ))}
        </div>
      )}

      {question.type === "multi" && (
        <div className="grid grid-cols-1 gap-2">
          {question.options.map((option) => {
            const selected = value.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onToggle(option.value)}
                className={`rounded-xl border px-4 py-3 text-left text-base font-semibold transition-colors ${
                  selected
                    ? "border-primary-600 bg-primary-600 text-white"
                    : "border-primary-100 bg-white text-gray-800 active:bg-primary-100"
                }`}
              >
                {selected ? "✓ " : ""}
                {t(option.labelKey)}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => onToggle(null)}
            className={`rounded-xl border px-4 py-3 text-left text-base font-semibold ${
              value.length === 0
                ? "border-primary-600 bg-primary-100 text-primary-700"
                : "border-primary-100 bg-white text-gray-500"
            }`}
          >
            {t("stNone")}
          </button>
        </div>
      )}
    </div>
  );
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
