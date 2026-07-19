/**
 * sessionStorage helpers — profile, results and language survive refresh
 * but clear when the browser session ends (no accounts, no server state).
 * All access is guarded so server-side rendering never touches storage.
 */

const KEYS = {
  lang: "thittam_lang",
  profile: "thittam_profile",
  results: "thittam_results",
};

function safeGet(key) {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    /* storage full/blocked — non-fatal */
  }
}

export function getStoredLang() {
  const value = safeGet(KEYS.lang);
  return value === "ta" || value === "en" ? value : "en";
}

export function storeLang(lang) {
  safeSet(KEYS.lang, lang);
}

export function storeProfile(profile) {
  safeSet(KEYS.profile, JSON.stringify(profile));
}

export function loadProfile() {
  const raw = safeGet(KEYS.profile);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function storeResults(results) {
  safeSet(KEYS.results, JSON.stringify(results));
}

export function loadResults() {
  const raw = safeGet(KEYS.results);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
