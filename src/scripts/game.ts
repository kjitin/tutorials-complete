// Gamification layer: XP, an engineering-career ladder, streaks and badges.
// Everything is *derived* from the learner's saved progress (lessons, known questions,
// quiz bests, active days) so XP can't be farmed by toggling things on and off.
import { progress, store, today } from './progress';

export interface GameStats {
  quizXp: Record<string, number>; // best XP per quiz attempt
  bullseyes: string[]; // `${quiz}:${q}` estimates within 1.25× of the reference
  tradeoffs: string[]; // trade-off duels answered with the right call AND the right reasons
  speedy: string[]; // estimates answered within 2× inside the speed window
  seen: string[]; // badges already announced with a toast
}

// Build-time facts the client needs (lesson counts per track, quiz ids). Emitted by BaseLayout.
export interface SiteFacts {
  tracks: Record<string, { title: string; total: number }>;
  quizzes: string[];
}

export const XP = {
  lesson: 20,
  known: 5,
  activeDay: 10,
  mcq: 10,
  estimate: { bullseye: 15, close: 10, ballpark: 4, speed: 5 },
  tradeoff: { call: 4, reasons: 6 },
} as const;

export const LEVELS = [
  { name: 'Intern', xp: 0 },
  { name: 'Junior Engineer', xp: 150 },
  { name: 'Engineer', xp: 400 },
  { name: 'Senior Engineer', xp: 900 },
  { name: 'Staff Engineer', xp: 1700 },
  { name: 'Principal Engineer', xp: 2800 },
  { name: 'Distinguished Engineer', xp: 4200 },
];

const EMPTY: GameStats = { quizXp: {}, bullseyes: [], tradeoffs: [], speedy: [], seen: [] };

export function stats(): GameStats {
  return { ...EMPTY, ...store.read<Partial<GameStats>>(store.KEYS.game, {}) };
}

function saveStats(next: GameStats, notify = true) {
  if (notify) return store.write(store.KEYS.game, next);
  try {
    localStorage.setItem(store.KEYS.game, JSON.stringify(next));
  } catch {}
}

const addUnique = (list: string[], items: string[]) => [...new Set([...list, ...items])];

/** Record a finished quiz attempt. Keeps the best XP per quiz and accumulates achievements. */
export function recordQuiz(
  quizId: string,
  xp: number,
  hits: { bullseyes: string[]; tradeoffs: string[]; speedy: string[] },
) {
  const s = stats();
  s.quizXp[quizId] = Math.max(s.quizXp[quizId] ?? 0, xp);
  s.bullseyes = addUnique(s.bullseyes, hits.bullseyes);
  s.tradeoffs = addUnique(s.tradeoffs, hits.tradeoffs);
  s.speedy = addUnique(s.speedy, hits.speedy);
  saveStats(s);
}

export function markSeen(ids: string[]) {
  const s = stats();
  s.seen = addUnique(s.seen, ids);
  saveStats(s, false);
}

// ---------- Streaks ----------

const dayMs = 86_400_000;
const toDate = (d: string) => new Date(`${d}T12:00:00`);

export function streaks(days: string[]) {
  const set = [...new Set(days)].sort();
  let best = 0;
  let run = 0;
  for (let i = 0; i < set.length; i++) {
    const gap = i ? Math.round((toDate(set[i]).getTime() - toDate(set[i - 1]).getTime()) / dayMs) : 0;
    run = gap === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }
  // Current streak: ends today, or yesterday if today has no activity yet.
  let current = 0;
  const has = new Set(set);
  const cursor = new Date();
  if (!has.has(today(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (has.has(today(cursor))) {
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { current, best, activeToday: has.has(today()) };
}

// ---------- Badges ----------

interface Ctx {
  completed: string[];
  known: number;
  scores: ReturnType<typeof progress.quizScores>;
  s: GameStats;
  streak: { current: number; best: number };
  facts: SiteFacts;
}

interface BadgeDef {
  id: string;
  emoji: string;
  name: string;
  desc: string;
  /** [current, goal] — the badge is earned when current >= goal. */
  measure: (c: Ctx) => [number, number];
}

const trackDone = (c: Ctx, track: string) => c.completed.filter((k) => k.startsWith(track + '/')).length;
const perfectQuizzes = (c: Ctx) => Object.values(c.scores).filter((q) => q.best === q.total && q.total > 0).length;

export const BADGES: BadgeDef[] = [
  { id: 'first-steps', emoji: '👣', name: 'First Steps', desc: 'Complete your first lesson', measure: (c) => [c.completed.length, 1] },
  { id: 'bookworm', emoji: '📚', name: 'Bookworm', desc: 'Complete 10 lessons', measure: (c) => [c.completed.length, 10] },
  {
    id: 'architect',
    emoji: '🏛️',
    name: 'Architect',
    desc: 'Finish every System Design lesson',
    measure: (c) => [trackDone(c, 'system-design'), c.facts.tracks['system-design']?.total ?? Infinity],
  },
  {
    id: 'completionist',
    emoji: '🎓',
    name: 'Completionist',
    desc: 'Finish any whole track',
    measure: (c) => [
      Math.max(0, ...Object.entries(c.facts.tracks).map(([id, t]) => (trackDone(c, id) >= t.total ? 1 : 0))),
      1,
    ],
  },
  { id: 'napkin-math', emoji: '🧮', name: 'Napkin Math', desc: 'Hit 5 estimation bullseyes (within 1.25×)', measure: (c) => [c.s.bullseyes.length, 5] },
  { id: 'speed-demon', emoji: '⚡', name: 'Speed Demon', desc: 'Nail 5 estimates inside the speed window', measure: (c) => [c.s.speedy.length, 5] },
  { id: 'tradeoff-thinker', emoji: '⚖️', name: 'Trade-off Thinker', desc: 'Win 5 trade-off duels with the right reasons', measure: (c) => [c.s.tradeoffs.length, 5] },
  { id: 'flawless', emoji: '💎', name: 'Flawless', desc: 'Score 100% on any quiz', measure: (c) => [perfectQuizzes(c), 1] },
  {
    id: 'quiz-master',
    emoji: '🏆',
    name: 'Quiz Master',
    desc: 'Attempt every quiz',
    measure: (c) => [c.facts.quizzes.filter((id) => c.scores[id]).length, c.facts.quizzes.length || Infinity],
  },
  { id: 'interview-ready', emoji: '🎤', name: 'Interview Ready', desc: 'Mark 50 interview questions as known', measure: (c) => [c.known, 50] },
  { id: 'on-a-roll', emoji: '🔥', name: 'On a Roll', desc: 'Keep a 3-day learning streak', measure: (c) => [c.streak.best, 3] },
  { id: 'habit-formed', emoji: '📅', name: 'Habit Formed', desc: 'Keep a 7-day learning streak', measure: (c) => [c.streak.best, 7] },
];

// ---------- Snapshot ----------

let factsCache: SiteFacts | null = null;
export function siteFacts(): SiteFacts {
  if (factsCache) return factsCache;
  try {
    const raw = document.querySelector<HTMLMetaElement>('meta[name="sw-facts"]')?.content;
    factsCache = raw ? (JSON.parse(raw) as SiteFacts) : { tracks: {}, quizzes: [] };
  } catch {
    factsCache = { tracks: {}, quizzes: [] };
  }
  return factsCache;
}

export function snapshot() {
  const completed = progress.completed();
  const known = progress.known().length;
  const scores = progress.quizScores();
  const days = progress.days();
  const s = stats();
  const streak = streaks(days);
  const facts = siteFacts();

  // Quizzes taken before XP existed fall back to 10 XP per correct answer.
  const quizXp = Object.entries(scores).reduce((sum, [id, q]) => sum + (s.quizXp[id] ?? q.best * XP.mcq), 0);
  const breakdown = {
    lessons: completed.length * XP.lesson,
    known: known * XP.known,
    quizzes: quizXp,
    streak: new Set(days).size * XP.activeDay,
  };
  const xp = breakdown.lessons + breakdown.known + breakdown.quizzes + breakdown.streak;

  const li = LEVELS.findLastIndex((l) => xp >= l.xp);
  const level = LEVELS[li];
  const next = LEVELS[li + 1];
  const pct = next ? Math.round(((xp - level.xp) / (next.xp - level.xp)) * 100) : 100;

  const ctx: Ctx = { completed, known, scores, s, streak, facts };
  const badges = BADGES.map((b) => {
    const [cur, goal] = b.measure(ctx);
    return { id: b.id, emoji: b.emoji, name: b.name, desc: b.desc, cur: Math.min(cur, goal), goal, earned: cur >= goal };
  });

  return { xp, breakdown, level: { ...level, index: li + 1 }, next, pct, streak, badges, seen: s.seen };
}

export type Snapshot = ReturnType<typeof snapshot>;

// ---------- Preferences ----------

const OFF_KEY = 'jf:game-off';
export function gameEnabled() {
  try {
    return localStorage.getItem(OFF_KEY) !== '1';
  } catch {
    return true;
  }
}
export function setGameEnabled(on: boolean) {
  try {
    on ? localStorage.removeItem(OFF_KEY) : localStorage.setItem(OFF_KEY, '1');
  } catch {}
  document.documentElement.toggleAttribute('data-game-off', !on);
  window.dispatchEvent(new CustomEvent('jf:progress'));
}

// ---------- Quiz scoring helpers (shared by the Quiz component) ----------

/** Parse "1.5k", "2 M", "3e9", "1,200", "40bn" into a number. Returns NaN if unparseable. */
export function parseAmount(input: string): number {
  const m = input
    .trim()
    .toLowerCase()
    .replace(/,/g, '')
    .match(/^(-?\d*\.?\d+(?:e[+-]?\d+)?)\s*(k|thousand|m|mn|million|b|bn|billion|t|tn|trillion)?$/);
  if (!m) return NaN;
  const mult: Record<string, number> = {
    k: 1e3, thousand: 1e3, m: 1e6, mn: 1e6, million: 1e6, b: 1e9, bn: 1e9, billion: 1e9, t: 1e12, tn: 1e12, trillion: 1e12,
  };
  return parseFloat(m[1]) * (m[2] ? mult[m[2]] : 1);
}

export function formatAmount(n: number): string {
  const abs = Math.abs(n);
  const fmt = (v: number, s: string) => `${Number(v.toPrecision(3))}${s}`;
  if (abs >= 1e12) return fmt(n / 1e12, 'T');
  if (abs >= 1e9) return fmt(n / 1e9, 'B');
  if (abs >= 1e6) return fmt(n / 1e6, 'M');
  if (abs >= 1e4) return fmt(n / 1e3, 'K');
  return String(Number(n.toPrecision(3)));
}

export type EstimateTier = 'bullseye' | 'close' | 'ballpark' | 'miss';
export function scoreEstimate(guess: number, answer: number) {
  const ratio = guess > 0 && answer > 0 ? Math.max(guess / answer, answer / guess) : Infinity;
  const tier: EstimateTier = ratio <= 1.25 ? 'bullseye' : ratio <= 2 ? 'close' : ratio <= 4 ? 'ballpark' : 'miss';
  const xp = tier === 'miss' ? 0 : XP.estimate[tier];
  return { ratio, tier, xp, correct: tier === 'bullseye' || tier === 'close' };
}

export function scoreTradeoff(callRight: boolean, picked: boolean[], valid: boolean[]) {
  const validCount = valid.filter(Boolean).length || 1;
  const hits = picked.filter((p, i) => p && valid[i]).length;
  const wrong = picked.filter((p, i) => p && !valid[i]).length;
  const reasonXp = Math.max(0, Math.round((hits / validCount) * XP.tradeoff.reasons - wrong * 2));
  const perfect = callRight && hits === validCount && wrong === 0;
  return { xp: (callRight ? XP.tradeoff.call : 0) + reasonXp, perfect, hits, wrong, validCount };
}
