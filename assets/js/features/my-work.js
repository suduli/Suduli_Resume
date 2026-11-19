/* My Work page: light/dark toggle, Archify embed theming and auto-height,
   reveal-on-scroll, progress bar and chapter highlight.
   Honors prefers-reduced-motion by showing everything statically. */
(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    const STORE_KEY = 'theme'; // same key the resume index uses, so the choice carries across pages

    // ---------- Light / dark toggle ----------
    const toggle = document.getElementById('mw-theme-toggle');
    const toggleIcon = document.getElementById('mw-theme-icon');
    const readStored = () => {
        try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
    };
    const writeStored = (mode) => {
        try { localStorage.setItem(STORE_KEY, mode); } catch (e) { /* storage blocked: keep in-memory only */ }
    };
    const currentMode = () => (root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    const paintToggle = () => {
        const next = currentMode() === 'light' ? 'dark' : 'light';
        if (toggleIcon) toggleIcon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        if (toggle) {
            toggle.setAttribute('aria-label', `Switch to ${next} theme`);
            toggle.setAttribute('title', `Switch to ${next} theme`);
        }
    };
    const setMode = (mode) => {
        root.setAttribute('data-theme', mode);
        writeStored(mode);
        paintToggle();
        frames.forEach(applyFrameTheme);
    };
    if (toggle) {
        toggle.addEventListener('click', () => setMode(currentMode() === 'light' ? 'dark' : 'light'));
    }
    paintToggle();

    // ---------- Archify embeds: palette, theme and auto-height ----------
    // Each embed is same-origin, so we can read its size and set its theme directly.
    // Archify reads ?theme= only at load, so changing the attribute avoids a reload.
    const SITE_TOKENS = {
        dark: {
            '--bg': '#0b0d10', '--grid': '#1c2028', '--panel': '#13171d', '--panel-border': 'rgba(236,235,230,0.16)',
            '--lane-fill': 'rgba(19,23,29,0.55)', '--lane-stroke': '#2a2f38', '--mask': '#13171d',
            '--text': '#ecebe6', '--text-muted': '#bcbdb6', '--text-faint': '#a3a69e', '--text-dim': '#8d9089',
            '--arrow': '#8d9089', '--arrow-emphasis': '#e7b26b', '--toolbar-bg': 'rgba(19,23,29,0.92)',
            '--toolbar-border': '#2a2f38', '--toolbar-text': '#ecebe6', '--toolbar-menu-bg': '#13171d'
        },
        light: {
            '--bg': '#f7f5f0', '--grid': '#e6e2d8', '--panel': '#ffffff', '--panel-border': '#d9d3c6',
            '--lane-fill': 'rgba(241,238,230,0.6)', '--lane-stroke': '#cfc8b8', '--mask': '#ffffff',
            '--text': '#17191c', '--text-muted': '#3d4147', '--text-faint': '#54585f', '--text-dim': '#6f7378',
            '--arrow': '#6b6e75', '--arrow-emphasis': '#7a4f0e', '--toolbar-bg': 'rgba(255,255,255,0.92)',
            '--toolbar-border': '#d9d3c6', '--toolbar-text': '#17191c', '--toolbar-menu-bg': '#ffffff'
        }
    };
    const tokenCss = (mode) => {
        const decl = Object.entries(SITE_TOKENS[mode]).map(([k, v]) => `${k}:${v};`).join('');
        return `html[data-preset][data-theme="${mode}"]{${decl}}`;
    };

    const frames = Array.from(document.querySelectorAll('.mw-embed-frame'));

    // Archify shows the viewer chrome (toolbar, guide, cards) unless told otherwise. The
    // embed needs only the diagram, so hide the chrome here. Motion runs only outside
    // embed mode, so the diagram is loaded without embed=1 and the chrome is hidden instead.
    const CHROME_CSS = `
        html .toolbar, html .header, html .cards, html .diagram-nav, html .overview-map,
        html .focus-chip, html .route-probe, html .semantic-lens, html .diagram-guide,
        html .node-finder, html .node-outline { display: none !important; }
        html body { padding: 0 !important; min-height: 0 !important; overflow: hidden !important; }
        html .container { max-width: none !important; }
        html .diagram-container { padding: 0.5rem !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
    `;
    // Diagrams play their motion only when the stored choice is "live". This is the
    // same origin as the embeds, so the choice carries to every diagram.
    try {
        if (localStorage.getItem("archify-motion") !== "live") localStorage.setItem("archify-motion", "live");
    } catch (e) { /* storage blocked: diagrams start still */ }

    const injectTokens = (doc) => {
        if (doc.getElementById('site-tokens')) return;
        const style = doc.createElement('style');
        style.id = 'site-tokens';
        style.textContent = tokenCss('dark') + tokenCss('light') + CHROME_CSS;
        doc.head.appendChild(style);
    };
    const applyFrameTheme = (frame) => {
        try {
            const doc = frame.contentDocument;
            if (!doc || !doc.documentElement) return;
            injectTokens(doc);
            doc.documentElement.setAttribute('data-theme', currentMode());
        } catch (e) { /* cross-origin (e.g. file://): leave the embed in its own theme */ }
    };
    // Height follows the diagram's own content, so nothing is cropped
    const fitFrame = (frame) => {
        try {
            const doc = frame.contentDocument;
            if (!doc || !doc.documentElement) return;
            // Measure the body, not the document: the document is pinned to the iframe's own viewport
            const body = doc.body;
            if (!body) return;
            const h = Math.ceil(Math.max(body.scrollHeight, body.getBoundingClientRect().height));
            if (h > 0) frame.style.height = h + 'px';
        } catch (e) { /* cross-origin: keep the CSS fallback height */ }
    };
    const initFrame = (frame) => {
        const sync = () => { applyFrameTheme(frame); fitFrame(frame); };
        frame.addEventListener('load', sync);
        if (frame.contentDocument && frame.contentDocument.readyState === 'complete') sync();
    };
    frames.forEach(initFrame);
    window.addEventListener('resize', () => frames.forEach(fitFrame), { passive: true });

    // ---------- Reveal animated elements as they enter the viewport ----------
    const targets = document.querySelectorAll('.reveal, .mw-timeline, .mw-bench');
    if ('IntersectionObserver' in window && !reduceMotion) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        targets.forEach((el) => io.observe(el));
    } else {
        targets.forEach((el) => el.classList.add('is-visible'));
    }

    // ---------- Reading progress bar ----------
    const bar = document.getElementById('mw-progress');
    const onScroll = () => {
        const max = root.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        if (bar) bar.style.transform = `scaleX(${p})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---------- Highlight the chapter currently in view ----------
    const links = Array.from(document.querySelectorAll('.mw-chapters a'));
    const sections = links
        .map((a) => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
        const navIo = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach((s) => navIo.observe(s));
    }
})();
