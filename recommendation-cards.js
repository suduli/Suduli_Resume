// Interactive Recommendation Cards Component
// Renders horizontally scrollable cards with expand/collapse on click

(function () {
    const CSV_PATH = './Recommendations_Received.csv';
    const SUMMARY_CONTAINER_ID = 'recommendation-summary';
    const CARDS_CONTAINER_ID = 'recommendation-cards';

    function truncate(text, max = 140) {
        if (!text) return '';
        const clean = String(text).trim();
        if (clean.length <= max) return clean;
        const cut = clean.slice(0, max);
        const lastSpace = cut.lastIndexOf(' ');
        return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut) + '…';
    }

    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++; // skip escaped quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (ch === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += ch;
            }
        }
        result.push(current);
        return result.map(v => v.trim());
    }

    function parseCSV(csvText) {
        const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length < 2) return [];
        const headers = parseCSVLine(lines[0]);
        const rows = [];
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            if (values.length !== headers.length) continue;
            const row = {};
            for (let j = 0; j < headers.length; j++) {
                row[headers[j]] = values[j];
            }
            rows.push(row);
        }
        return rows;
    }

    // Generate deterministic HSL color from a string
    function colorFromString(str) {
        const s = String(str || '');
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            hash = (hash << 5) - hash + s.charCodeAt(i);
            hash |= 0; // Convert to 32bit int
        }
        const hue = Math.abs(hash) % 360;
        const sat = 65; // %
        const light = 55; // %
        return {
            accent: `hsl(${hue} ${sat}% ${light}%)`,
            accentBg: `hsl(${hue} ${sat}% ${light}% / 0.12)`,
        };
    }

    async function loadRecommendations() {
        try {
            const res = await fetch(CSV_PATH);
            if (!res.ok) throw new Error(`Failed to fetch CSV (${res.status})`);
            const text = await res.text();
            const all = parseCSV(text);
            // Only visible ones
            const visible = all.filter(r => (r.Status || '').toUpperCase() === 'VISIBLE');
            // Deduplicate by First + Last + Company + Text
            const seen = new Set();
            const deduped = [];
            for (const r of visible) {
                const key = [r['First Name'], r['Last Name'], r.Company, r.Text].join('|');
                if (!seen.has(key)) {
                    seen.add(key);
                    deduped.push(r);
                }
            }
            return deduped;
        } catch (err) {
            console.warn('[recommendation-cards] CSV load failed, using fallback data:', err);
            // Fallback minimal sample to avoid empty UI locally
            return [
                {
                    'First Name': 'Sample',
                    'Last Name': 'User',
                    Company: 'Example Corp',
                    'Job Title': 'Lead Engineer',
                    Text: 'Suduli consistently delivered high-quality validation with strong problem-solving skills and team collaboration.',
                    'Creation Date': '01/01/2025, 09:00 AM',
                    Status: 'VISIBLE',
                }
            ];
        }
    }

    // --- New helpers to avoid unwanted page nudges ---
    function isMostlyInView(el, ratio = 0.6) {
        if (!el) return true;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
        const height = Math.max(1, r.height || 1);
        return (visible / height) >= ratio;
    }

    function safeScrollIntoView(el, opts = { behavior: 'smooth', block: 'nearest' }) {
        if (!el) return;
        if (!isMostlyInView(el)) {
            el.scrollIntoView(opts);
        }
    }

    function createCard(rec, index) {
        const name = `${rec['First Name'] || ''} ${rec['Last Name'] || ''}`.trim();
        const company = rec.Company || '';
        const title = rec['Job Title'] || '';
        const date = rec['Creation Date'] || '';
        const text = rec.Text || '';
        const excerpt = truncate(text, 180);
        const photo = rec.Photo || rec['Photo URL'] || '';
    // Normalize/sanitize LinkedIn URL
    const rawLinkedIn = (rec.LinkedIn || rec['LinkedIn URL'] || rec['LinkedIn Profile'] || '').trim();
    const linkedIn = /^https?:\/\//i.test(rawLinkedIn) ? rawLinkedIn : '';
        const { accent, accentBg } = colorFromString(name || company || index);

        const card = document.createElement('article');
        card.className = 'rec-card';
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-expanded', 'false');
        card.setAttribute('aria-label', `Recommendation from ${name} at ${company}`);
        card.style.setProperty('--rec-accent', accent);
        card.style.setProperty('--rec-accent-bg', accentBg);

        const avatarHTML = photo
            ? `<div class="rec-avatar with-img"><img class="rec-avatar-img" src="${photo}" alt="${name || 'Recommender'} photo" loading="lazy"/></div>`
            : `<div class="rec-avatar" aria-hidden="true">${(rec['First Name'] || 'R')[0]}${(rec['Last Name'] || 'C')[0]}</div>`;

        const linksHTML = linkedIn
            ? `<div class="rec-links"><a href="${linkedIn}" target="_blank" rel="noopener noreferrer nofollow" aria-label="LinkedIn profile of ${name}"><i class="fab fa-linkedin"></i></a></div>`
            : `<div class="rec-links" aria-hidden="true"></div>`;

        card.innerHTML = `
            <div class="rec-card-inner">
                <header class="rec-card-header">
                    ${avatarHTML}
                    <div class="rec-meta">
                        <h3 class="rec-name">${name || 'Anonymous'}</h3>
                        <p class="rec-company">${company}${title ? ' • ' + title : ''}</p>
                    </div>
                    ${linksHTML}
                </header>
                <div class="rec-summary">
                    <span class="rec-quote-icon" aria-hidden="true"><i class="fas fa-quote-left"></i></span>
                    <p class="rec-excerpt">${excerpt}</p>
                </div>
                <div class="rec-details" hidden>
                    <p class="rec-full">${text}</p>
                </div>
                <div class="rec-toggle"><span class="rec-toggle-text">View</span><i class="fas fa-chevron-down" aria-hidden="true"></i></div>
            </div>
        `;

        function centerHorizontally(el) {
            const wrapper = el.closest('.rec-cards-wrapper');
            if (!wrapper) return;
            const wrapperRect = wrapper.getBoundingClientRect();
            const cardRect = el.getBoundingClientRect();
            const cardWidth = el.clientWidth;
            const viewportWidth = wrapper.clientWidth;
            const currentScroll = wrapper.scrollLeft;
            // Position of card's left edge inside wrapper's visible area + current scroll offset
            const cardLeft = (cardRect.left - wrapperRect.left) + currentScroll;
            let target = cardLeft - (viewportWidth - cardWidth) / 2;
            // Clamp to scrollable bounds to avoid overscroll
            const maxScroll = Math.max(0, wrapper.scrollWidth - viewportWidth);
            target = Math.max(0, Math.min(target, maxScroll));
            wrapper.scrollTo({ left: target, behavior: 'smooth' });
        }

        function centerVertically(el, offset = 0) {
            const rect = el.getBoundingClientRect();
            const elHeight = rect.height;
            const viewportHeight = window.innerHeight;
            const currentY = window.scrollY || window.pageYOffset;
            let targetY = rect.top + currentY - (viewportHeight - elHeight) / 2 - offset;
            if (targetY < 0) targetY = 0;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
        }

        function toggle() {
            const wrapper = card.closest('.rec-cards-wrapper');
            const toggleText = card.querySelector('.rec-toggle-text');

            // If another card is expanded, collapse it first
            const currentlyExpanded = wrapper ? wrapper.querySelector('.rec-card.expanded') : null;
            if (currentlyExpanded && currentlyExpanded !== card) {
                const detailsPrev = currentlyExpanded.querySelector('.rec-details');
                const summaryPrev = currentlyExpanded.querySelector('.rec-summary');
                // restore excerpt on previous card if missing
                if (summaryPrev && !summaryPrev.querySelector('.rec-excerpt')) {
                    const pPrev = document.createElement('p');
                    pPrev.className = 'rec-excerpt';
                    pPrev.textContent = summaryPrev.dataset.excerptBackup || '';
                    summaryPrev.appendChild(pPrev);
                }
                if (detailsPrev) detailsPrev.hidden = true;
                currentlyExpanded.classList.remove('expanded');
                currentlyExpanded.setAttribute('aria-expanded', 'false');
            }

            const becameExpanded = card.classList.toggle('expanded');
            const details = card.querySelector('.rec-details');
            const summary = card.querySelector('.rec-summary');
            const excerptEl = card.querySelector('.rec-excerpt');

            if (details) details.hidden = !becameExpanded;

            // Cache excerpt for restoration on this card
            if (summary && !summary.dataset.excerptBackup) {
                summary.dataset.excerptBackup = excerpt;
            }

            if (becameExpanded) {
                if (excerptEl) excerptEl.remove();
                if (wrapper) {
                    wrapper.classList.add('has-expanded');
                    wrapper.dataset.paused = 'true';
                }
                // Recenter after styles apply
                requestAnimationFrame(() => {
                    centerHorizontally(card);
                    // Removed vertical centering to avoid page nudge
                    // If the card is far off-screen vertically, do a minimal scroll
                    safeScrollIntoView(card, { behavior: 'smooth', block: 'nearest' });
                });
                // Recenter on window resize
                const onResize = () => centerHorizontally(card);
                window.addEventListener('resize', onResize, { passive: true });
                card._onResize = onResize;
                // Recenter when avatar image loads (layout shift)
                const img = card.querySelector('.rec-avatar-img');
                if (img && !img.complete) {
                    const onLoad = () => centerHorizontally(card);
                    img.addEventListener('load', onLoad, { once: true });
                }
            } else {
                if (summary && !summary.querySelector('.rec-excerpt')) {
                    const p = document.createElement('p');
                    p.className = 'rec-excerpt';
                    p.textContent = summary.dataset.excerptBackup || excerpt;
                    summary.appendChild(p);
                }
                if (wrapper) {
                    wrapper.classList.remove('has-expanded');
                    delete wrapper.dataset.paused;
                }
                // Cleanup resize listener if set
                if (card._onResize) {
                    window.removeEventListener('resize', card._onResize);
                    delete card._onResize;
                }
            }

            card.setAttribute('aria-expanded', String(becameExpanded));
            if (toggleText) toggleText.textContent = becameExpanded ? 'Hide' : 'View';
        }

        // Clicks only on the inner card area should toggle expansion
        card.querySelector('.rec-card-inner').addEventListener('click', (e) => {
            // Ignore clicks on links inside details (if any)
            const a = e.target.closest('a');
            if (a) return;
            toggle();
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });

        return card;
    }

    function ensureCardsContainer() {
        let container = document.getElementById(CARDS_CONTAINER_ID);
        if (container) return container;

        container = document.createElement('div');
        container.id = CARDS_CONTAINER_ID;
        container.className = 'rec-cards-container';

        const parent = document.getElementById(SUMMARY_CONTAINER_ID);
        if (parent && parent.parentElement) {
            parent.parentElement.insertBefore(container, parent.nextSibling);
        } else {
            document.body.appendChild(container);
        }
        return container;
    }

    function renderLoading(container) {
        container.innerHTML = `
            <div class="rec-loading">
                <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
                <span>Loading recommendations…</span>
            </div>
        `;
    }

    function renderCards(container, recs) {
        const count = recs.length;
        container.innerHTML = `
            <h3 class="rec-cards-title">Recommendations <span class="rec-count">(${count})</span></h3>
            <div class="rec-cards-wrapper" aria-label="Recommendation cards" role="list">
                <div class="scroller__inner" role="none"></div>
            </div>
        `;
        const wrapper = container.querySelector('.rec-cards-wrapper');
        const track = wrapper.querySelector('.scroller__inner');
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Build initial set
        const originals = [];
        for (let i = 0; i < recs.length; i++) {
            const card = createCard(recs[i], i);
            card.setAttribute('role', 'listitem');
            originals.push(card);
            track.appendChild(card);
        }

        // Progressive enhancement: enable infinite marquee if conditions allow
        // Criteria: at least 3 items and user does not prefer reduced motion
        const canAnimate = !prefersReduced && originals.length >= 3;
        if (canAnimate) {
            // Duplicate the set once for seamless loop
            const clones = originals.map((node) => {
                const clone = node.cloneNode(true);
                clone.dataset.clone = 'true';
                clone.setAttribute('aria-hidden', 'true');
                clone.removeAttribute('role');
                clone.tabIndex = -1;
                return clone;
            });
            clones.forEach(c => track.appendChild(c));

            // Mark animated and compute a sane duration based on total width
            // After layout paint, measure width of half track (originals + gaps)
            requestAnimationFrame(() => {
                try {
                    // If no size yet, fallback duration
                    let duration = 45; // seconds default
                    const firstHalfWidth = originals.reduce((acc, el, idx) => acc + el.offsetWidth, 0) + (originals.length - 1) * 16;
                    // px per second target speed (~50 px/s desktop, ~35 px/s mobile)
                    const speed = window.innerWidth < 640 ? 35 : 50; // px/s
                    if (firstHalfWidth > 0) {
                        duration = Math.max(18, Math.min(70, firstHalfWidth / speed));
                    }
                    track.style.setProperty('--_rec-marquee-duration', `${duration}s`);
                    wrapper.dataset.animated = 'true';
                } catch (e) {
                    // If measurement failed, keep non-animated fallback
                }
            });

            // Pause on key interactions automatically handled via CSS with :hover and :focus-within
            // Also pause when a card expands (we toggle has-expanded on wrapper already)

            // Improve keyboard accessibility: ensure focus does not move into clones
            // Already made clones aria-hidden and tabindex=-1 above.
        } else {
            // Keep the grid/scroll-snap fallback (no scroller animation)
            // Move cards from track back into wrapper if any
            while (track.firstChild) {
                wrapper.appendChild(track.firstChild);
            }
            track.remove();
        }
    }

    function attachTrigger() {
        const root = document.getElementById(SUMMARY_CONTAINER_ID);
        if (!root) return;

        // Delegate to handle re-renders
        root.addEventListener('click', async (e) => {
            const info = e.target.closest('.recommendation-info');
            if (!info) return;

            // Prevent hash-anchor default jump if any
            const anchor = e.target.closest('a[href^="#"]');
            if (anchor) e.preventDefault();

            const container = ensureCardsContainer();
            if (!container.dataset.loaded) {
                renderLoading(container);
                const recs = await loadRecommendations();
                renderCards(container, recs);
                container.dataset.loaded = 'true';
                // Intentionally no scrolling here to avoid any nudge
            } else {
                // Already loaded: do nothing scroll-wise
            }
        });
    }

    if (typeof window !== 'undefined') {
        document.addEventListener('DOMContentLoaded', attachTrigger);
    }
})();
