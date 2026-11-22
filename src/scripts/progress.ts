// Learner progress persisted in localStorage. Every access is guarded because
// storage can be unavailable (private mode, blocked site data).
export interface Bookmark {
  key: string;
  title: string;
  url: string;
  section: string;
}
export interface QuizScore {
  best: number;
  last: number;
  total: number;
  at: number;
}

const KEYS = {
  done: 'jf:completed',
  bookmarks: 'jf:bookmarks',
  quiz: 'jf:quiz',
  known: 'jf:known',
  days: 'jf:days', // active days (YYYY-MM-DD) for streaks
  game: 'jf:game', // gamification stats, see game.ts
} as const;

export const today = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Any learning activity counts towards today's streak (keep the last 400 days).
    const days = read<string[]>(KEYS.days, []);
    const d = today();
    if (!days.includes(d)) localStorage.setItem(KEYS.days, JSON.stringify([...days, d].slice(-400)));
  } catch {
    /* storage unavailable — progress just won't persist */
  }
  window.dispatchEvent(new CustomEvent('jf:progress'));
}

// Shared low-level access for game.ts, so all keys live (and reset) in one place.
export const store = { read, write, KEYS };

function toggleIn(key: string, id: string): boolean {
  const list = read<string[]>(key, []);
  const on = !list.includes(id);
  write(key, on ? [...list, id] : list.filter((x) => x !== id));
  return on;
}

export const progress = {
  completed: () => read<string[]>(KEYS.done, []),
  isDone: (id: string) => read<string[]>(KEYS.done, []).includes(id),
  toggleDone: (id: string) => toggleIn(KEYS.done, id),

  bookmarks: () => read<Bookmark[]>(KEYS.bookmarks, []),
  isBookmarked: (id: string) => read<Bookmark[]>(KEYS.bookmarks, []).some((b) => b.key === id),
  toggleBookmark(b: Bookmark): boolean {
    const list = read<Bookmark[]>(KEYS.bookmarks, []);
    const on = !list.some((x) => x.key === b.key);
    write(KEYS.bookmarks, on ? [b, ...list] : list.filter((x) => x.key !== b.key));
    return on;
  },

  quizScores: () => read<Record<string, QuizScore>>(KEYS.quiz, {}),
  saveQuiz(id: string, score: number, total: number) {
    const all = read<Record<string, QuizScore>>(KEYS.quiz, {});
    const prev = all[id];
    all[id] = { best: Math.max(prev?.best ?? 0, score), last: score, total, at: Date.now() };
    write(KEYS.quiz, all);
  },

  known: () => read<string[]>(KEYS.known, []),
  days: () => read<string[]>(KEYS.days, []),
  toggleKnown: (id: string) => toggleIn(KEYS.known, id),

  reset() {
    Object.values(KEYS).forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });
    window.dispatchEvent(new CustomEvent('jf:progress'));
  },
};
