// Site-wide behaviour: theme toggle, copy buttons, mobile nav, Mermaid diagrams.

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
