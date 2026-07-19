"use client";

/**
 * The 8-question wizard: one question at a time, tap-only, progress bar,
 * back button, summary card, then submit -> /api/match -> /results.
 * Answers are held in React state and persisted to sessionStorage on submit.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";
import QuestionStep from "@/components/QuestionStep";
import LoadingMatcher from "@/components/LoadingMatcher";
import { useLanguage } from "@/lib/i18n";
import { postMatch } from "@/lib/api";
import { storeProfile, storeResults } from "@/lib/session";

const QUESTIONS = [
  { field: "age", titleKey: "qAge", type: "stepper", min: 1, max: 100 },
  {
    field: "gender", titleKey: "qGender", type: "options",
    options: [
      { value: "female", labelKey: "female" },
      { value: "male", labelKey: "male" },
      { value: "other", labelKey: "otherGender" },
    ],
  },
  {
    field: "state", titleKey: "qState", type: "options",
    options: [
      { value: "TN", labelKey: "stateTN" },
      { value: "OTHER", labelKey: "stateOther" },
    ],
  },
  {
    field: "area", titleKey: "qArea", type: "options",
    options: [
      { value: "rural", labelKey: "rural" },
      { value: "urban", labelKey: "urban" },
    ],
  },
  {
    field: "occupation", titleKey: "qOccupation", type: "options",
    options: [
      { value: "student", labelKey: "occStudent" },
      { value: "farmer", labelKey: "occFarmer" },
      { value: "daily_wage", labelKey: "occDailyWage" },
      { value: "self_employed", labelKey: "occSelfEmployed" },
      { value: "salaried", labelKey: "occSalaried" },
      { value: "homemaker", labelKey: "occHomemaker" },
      { value: "unemployed", labelKey: "occUnemployed" },
      { value: "other", labelKey: "occOther" },
    ],
  },
  {
    field: "annual_income", titleKey: "qIncome", type: "options",
    options: [
      { value: 72000, labelKey: "inc72k" },
      { value: 120000, labelKey: "inc120k" },
      { value: 250000, labelKey: "inc250k" },
      { value: 350000, labelKey: "inc350k" },
      { value: 450000, labelKey: "inc450k" },
      { value: 900000, labelKey: "inc900k" },
      { value: 1200000, labelKey: "incAbove" },
    ],
  },
  {
    field: "social_category", titleKey: "qCategory", type: "options",
    options: [
      { value: "general", labelKey: "catGeneral" },
      { value: "obc", labelKey: "catOBC" },
      { value: "sc_st", labelKey: "catSCST" },
      { value: "ews", labelKey: "catEWS" },
      { value: "minority", labelKey: "catMinority" },
    ],
  },
  {
    field: "special_statuses", titleKey: "qSpecial", hintKey: "qSpecialHint", type: "multi",
    options: [
      { value: "student", labelKey: "stStudent" },
      { value: "farmer", labelKey: "stFarmer" },
      { value: "widow", labelKey: "stWidow" },
      { value: "disabled", labelKey: "stDisabled" },
      { value: "pregnant", labelKey: "stPregnant" },
      { value: "first_gen_graduate", labelKey: "stFirstGen" },
    ],
  },
];

const SUMMARY_STEP = QUESTIONS.length;

export default function CheckPage() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ age: 25, special_statuses: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const question = QUESTIONS[step];

  const setAnswer = (field, value) => {
    setAnswers((prev) => {
      const next = { ...prev, [field]: value };
      // If gender changes to male (e.g. via Back), drop female-only statuses.
      if (field === "gender" && value === "male") {
        next.special_statuses = (next.special_statuses || []).filter(
          (status) => !["widow", "pregnant"].includes(status)
        );
      }
      return next;
    });
  };

  const handleSelect = (value) => {
    setAnswer(question.field, value);
    if (question.type === "options") {
      setTimeout(() => setStep((s) => s + 1), 150);
    }
  };

  const handleToggle = (value) => {
    if (value === null) {
      setAnswer("special_statuses", []);
      return;
    }
    const current = answers.special_statuses;
    setAnswer(
      "special_statuses",
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    );
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const results = await postMatch(answers);
      storeProfile(answers);
      storeResults(results);
      router.push("/results");
    } catch (err) {
      const message =
        (lang === "ta" ? err.message_ta : err.message_en) || t("errorTitle");
      setError(message);
      setLoading(false);
    }
  };

  if (loading) return <LoadingMatcher />;

  if (step === SUMMARY_STEP) {
    return (
      <div>
        <h2 className="mb-4 text-xl font-bold">{t("summaryTitle")}</h2>
        <div className="mb-6 divide-y divide-primary-50 rounded-2xl border border-primary-100 bg-white">
          {QUESTIONS.map((q, index) => (
            <div key={q.field} className="flex items-center justify-between gap-2 px-4 py-3">
              <div>
                <p className="text-xs text-gray-500">{t(q.titleKey)}</p>
                <p className="text-sm font-semibold">{answerLabel(q, answers, t)}</p>
              </div>
              <button
                type="button"
                onClick={() => setStep(index)}
                className="text-sm font-bold text-primary-600"
              >
                {t("edit")}
              </button>
            </div>
          ))}
        </div>
        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full rounded-2xl bg-primary-600 px-6 py-4 text-lg font-bold text-white shadow-md active:bg-primary-700"
        >
          {error ? t("tryAgain") : t("submit")} →
        </button>
      </div>
    );
  }

  const canAdvance =
    question.type === "multi" || answers[question.field] !== undefined;

  // Female-only statuses (widow, pregnant) are hidden for male users —
  // the option set adapts to earlier answers.
  const visibleQuestion =
    question.field === "special_statuses" && answers.gender === "male"
      ? {
          ...question,
          options: question.options.filter(
            (option) => !["widow", "pregnant"].includes(option.value)
          ),
        }
      : question;

  return (
    <div>
      <ProgressBar current={step + 1} total={QUESTIONS.length} />
      <QuestionStep
        question={visibleQuestion}
        value={answers[question.field] ?? (question.type === "multi" ? [] : undefined)}
        onSelect={handleSelect}
        onToggle={handleToggle}
      />
      <div className="mt-6 flex gap-2">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 rounded-xl border border-primary-100 bg-white px-4 py-3 font-semibold text-gray-700"
          >
            ← {t("back")}
          </button>
        )}
        {(question.type === "stepper" || question.type === "multi") && (
          <button
            type="button"
            disabled={!canAdvance}
            onClick={() => setStep((s) => s + 1)}
            className="flex-1 rounded-xl bg-primary-600 px-4 py-3 font-bold text-white active:bg-primary-700 disabled:opacity-40"
          >
            {t("next")} →
          </button>
        )}
      </div>
    </div>
  );
}

function answerLabel(question, answers, t) {
  const value = answers[question.field];
  if (question.type === "stepper") return `${value} ${t("years")}`;
  if (question.type === "multi") {
    if (!value || value.length === 0) return t("stNone");
    return value
      .map((v) => t(question.options.find((o) => o.value === v)?.labelKey))
      .join(", ");
  }
  if (value === undefined) return "—";
  return t(question.options.find((o) => o.value === value)?.labelKey);
}
