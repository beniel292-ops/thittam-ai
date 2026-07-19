"use client";

export default function ChatMessage({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-primary-600 text-white"
            : "rounded-bl-sm border border-primary-100 bg-white text-gray-800"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
