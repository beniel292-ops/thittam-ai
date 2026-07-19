"use client";

/**
 * Grounded chat about one scheme. Route param is the scheme SLUG (public,
 * readable); the page fetches the full record and uses its uuid for
 * /api/chat. History lives in React state — the backend is stateless and
 * receives the last turns with every request.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ChatMessage from "@/components/ChatMessage";
import { useLanguage } from "@/lib/i18n";
import { getScheme, postChat } from "@/lib/api";
import { loadProfile } from "@/lib/session";

const MAX_HISTORY_TURNS = 6;
const MAX_QUESTION_CHARS = 500;
const STARTER_CHIPS = ["chip1", "chip2", "chip3"];

export default function ChatPage() {
  const { schemeId: slug } = useParams();
  const { lang, t } = useLanguage();
  const [scheme, setScheme] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    getScheme(slug)
      .then((data) => setScheme(data.scheme))
      .catch(() => setLoadError(true));
  }, [slug]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, waiting]);

  const ask = async (question) => {
    const trimmed = question.trim().slice(0, MAX_QUESTION_CHARS);
    if (!trimmed || waiting || !scheme) return;
    setInput("");
    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setWaiting(true);
    try {
      const data = await postChat({
        scheme_id: scheme.id,
        language: lang,
        question: trimmed,
        history: messages.slice(-MAX_HISTORY_TURNS),
        profile: loadProfile() ?? undefined,
      });
      setMessages([...nextMessages, { role: "assistant", content: data.answer }]);
    } catch (err) {
      const message =
        (lang === "ta" ? err.message_ta : err.message_en) || t("errorTitle");
      setMessages([...nextMessages, { role: "assistant", content: message }]);
    } finally {
      setWaiting(false);
    }
  };

  if (loadError) {
    return (
      <div className="py-10 text-center">
        <p className="font-semibold text-gray-700">{t("errorTitle")}</p>
        <Link href="/results" className="mt-4 inline-block font-bold text-primary-600">
          ← {t("backToResults")}
        </Link>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
      </div>
    );
  }

  const name = lang === "ta" ? scheme.name_ta : scheme.name_en;

  return (
    <div className="flex h-[calc(100vh-160px)] flex-col">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h1 className="text-base font-bold leading-snug">{name}</h1>
        <Link
          href="/results"
          className="shrink-0 text-sm font-bold text-primary-600"
        >
          ← {t("backToResults")}
        </Link>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {messages.length === 0 && (
          <div>
            <p className="mb-3 rounded-xl bg-primary-50 px-3 py-2 text-sm text-gray-700">
              {t("chatIntro")}
            </p>
            <div className="flex flex-col gap-2">
              {STARTER_CHIPS.map((chipKey) => (
                <button
                  key={chipKey}
                  type="button"
                  onClick={() => ask(t(chipKey))}
                  className="rounded-xl border border-primary-100 bg-white px-4 py-3 text-left text-sm font-semibold text-primary-700 active:bg-primary-50"
                >
                  {t(chipKey)}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <ChatMessage key={index} role={message.role} content={message.content} />
        ))}

        {waiting && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm border border-primary-100 bg-white px-4 py-3">
              <span className="inline-flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-500" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-500 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-500 [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          ask(input);
        }}
        className="mt-2 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={MAX_QUESTION_CHARS}
          placeholder={t("chatPlaceholder")}
          className="min-w-0 flex-1 rounded-xl border border-primary-100 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500"
        />
        <button
          type="submit"
          disabled={waiting || !input.trim()}
          className="rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-40"
        >
          {t("send")}
        </button>
      </form>
    </div>
  );
}
