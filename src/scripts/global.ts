// Site-wide behaviour: theme toggle, copy buttons, mobile nav, Mermaid diagrams, XP toasts.
import { gameEnabled, markSeen, snapshot, type Snapshot } from './game';

type Theme = 'dark' | 'light';
const root = document.documentElement;
const currentTheme = () => (root.dataset.theme as Theme) || 'dark';

function setTheme(theme: Theme) {
  root.dataset.theme = theme;
  try {
    localStorage.setItem('jf:theme', theme);
  } catch {}
  window.dispatchEvent(new CustomEvent('jf:theme', { detail: theme }));
}

document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) =>
  btn.addEventListener('click', () => setTheme(currentTheme() === 'dark' ? 'light' : 'dark')),
);

// Mobile navigation drawer
const drawer = document.querySelector<HTMLElement>('[data-drawer]');
document.querySelectorAll('[data-drawer-toggle]').forEach((btn) =>
  btn.addEventListener('click', () => {
    const open = drawer?.toggleAttribute('data-open');
    document.body.style.overflow = open ? 'hidden' : '';
  }),
);

// Copy buttons on every highlighted code block
function addCopyButtons(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLPreElement>('pre.astro-code').forEach((pre) => {
    if (pre.parentElement?.classList.contains('code-wrap') || pre.closest('[data-no-copy]')) return;
    const wrap = document.createElement('div');
    wrap.className = 'code-wrap';
    wrap.hidden = pre.hidden; // keep CodeTabs visibility when the wrapper takes the pre's place
    pre.hidden = false;
    pre.replaceWith(wrap);
    wrap.appendChild(pre);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText);
        btn.textContent = 'Copied';
        btn.classList.add('copied');
      } catch {
        btn.textContent = 'Failed';
      }
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 1600);
    });
    wrap.appendChild(btn);
  });
}
addCopyButtons();

// Mermaid diagrams — loaded lazily, only on pages that contain one
const sources = [...document.querySelectorAll<HTMLElement>('code.language-mermaid')].map(
  (code) => code.closest('pre') ?? code,
);
if (sources.length) {
  const boxes = sources.map((pre) => {
    const box = document.createElement('figure');
    box.className = 'diagram';
    box.dataset.src = pre.textContent ?? '';
    box.setAttribute('role', 'img');
    pre.replaceWith(box);
    return box;
  });

  import('mermaid').then(({ default: mermaid }) => {
    let run = 0;
    const render = async () => {
      const dark = currentTheme() === 'dark';
      const css = getComputedStyle(root);
      const v = (n: string) => css.getPropertyValue(n).trim();
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        fontFamily: 'Inter, system-ui, sans-serif',
        themeVariables: {
          darkMode: dark,
          background: v('--surface'),
          primaryColor: v('--surface-2'),
          primaryBorderColor: dark ? '#8b5cf6' : '#a855f7',
          primaryTextColor: v('--text'),
          secondaryColor: v('--surface-2'),
          tertiaryColor: v('--surface'),
          lineColor: v('--muted'),
          textColor: v('--text'),
          mainBkg: v('--surface-2'),
          nodeBorder: dark ? '#8b5cf6' : '#a855f7',
          clusterBkg: v('--surface'),
          actorBkg: v('--surface-2'),
          actorBorder: dark ? '#8b5cf6' : '#a855f7',
          actorTextColor: v('--text'),
          signalColor: v('--text-soft'),
          signalTextColor: v('--text'),
          noteBkgColor: v('--surface'),
          noteTextColor: v('--text'),
          fontSize: '14px',
        },
      });
      const thisRun = ++run;
      for (const [i, box] of boxes.entries()) {
        try {
          const { svg } = await mermaid.render(`mmd-${thisRun}-${i}`, box.dataset.src!);
          if (thisRun === run) box.innerHTML = svg;
        } catch (err) {
          box.innerHTML = `<pre style="text-align:left;color:var(--err)">Diagram error: ${String(err)}</pre>`;
        }
      }
    };
    render();
    window.addEventListener('jf:theme', render);
  });
}

// Gamification: header XP pill + toasts for XP gains, level-ups and new badges.

const pill = document.querySelector<HTMLElement>('[data-xp-pill]');
let toastBox: HTMLElement | null = null;

function toast(html: string, cls = '') {
  if (!toastBox) {
    toastBox = document.createElement('div');
    toastBox.className = 'toasts';
    toastBox.setAttribute('role', 'status');
    toastBox.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastBox);
  }
  const el = document.createElement('div');
  el.className = `toast ${cls}`;
  el.innerHTML = html;
  toastBox.appendChild(el);
  setTimeout(() => el.classList.add('out'), 3600);
  setTimeout(() => el.remove(), 4000);
}

function paintPill(s: Snapshot) {
  if (!pill) return;
  pill.hidden = false;
  pill.querySelector('[data-xp-lv]')!.textContent = `Lv ${s.level.index}`;
  pill.querySelector('[data-xp-num]')!.textContent = s.xp.toLocaleString();
  pill.title = `${s.level.name} · ${s.xp} XP${s.next ? ` · ${s.next.xp - s.xp} XP to ${s.next.name}` : ''}`;
  const streak = pill.querySelector<HTMLElement>('[data-xp-streak]')!;
  streak.hidden = s.streak.current < 2;
  streak.querySelector('b')!.textContent = String(s.streak.current);
}

let last = snapshot();
// Badges earned before this page loaded are shown on /progress, not toasted.
markSeen(last.badges.filter((b) => b.earned).map((b) => b.id));
paintPill(last);

// Several writes can happen in one interaction (e.g. quiz XP + score + today's streak);
// coalesce them so the learner sees one combined toast.
let pending = false;
window.addEventListener('jf:progress', () => {
  if (pending) return;
  pending = true;
  setTimeout(() => {
    pending = false;
    onProgress();
  }, 0);
});

function onProgress() {
  const now = snapshot();
  paintPill(now);
  if (gameEnabled()) {
    const gained = now.xp - last.xp;
    if (gained > 0) toast(`<span class="t-emoji">✨</span><span><b>+${gained} XP</b></span>`, 'xp');
    if (now.level.index > last.level.index)
      toast(`<span class="t-emoji">🚀</span><span>Promoted to <b>${now.level.name}</b><small>Level ${now.level.index}</small></span>`);
    const fresh = now.badges.filter((b) => b.earned && !now.seen.includes(b.id));
    fresh.forEach((b) =>
      toast(`<span class="t-emoji">${b.emoji}</span><span>Badge unlocked: <b>${b.name}</b><small>${b.desc}</small></span>`),
    );
    if (fresh.length) markSeen(fresh.map((b) => b.id));
  }
  last = now;
}
