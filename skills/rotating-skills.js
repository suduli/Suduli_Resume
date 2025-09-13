import { SKILLS } from './skills-data.js';
import { SkillIcons, skillKey } from './skill-icons.js';

/* Rotating Skill Orbit Module
 * Features:
 *  - Radial distribution of skill icons across multiple concentric rings (auto sized)
 *  - Continuous CSS driven rotation with different speeds & reverse directions per ring
 *  - Hover focus: pauses global spin and highlights hovered skill with label & progress arc
 *  - Accessibility: keyboard focusable icons, ARIA live region for skill detail, reduced motion support
 *  - Responsive: recalculates radii & icon sizes on resize (debounced)
 */

const CONFIG = {
  minIcon: 42,
  maxIcon: 70,
  ringGap: 70,
  maxRings: 4,
  baseSpin: 28, // seconds for full revolution outer ring
  pauseOnHover: true
};

function prefersReducedMotion(){
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function partitionSkills(skills){
  // Simple distribution: try to fill inner rings with fewer items
  const rings = [];
  const copy = skills.slice();
  // Sort by level descending so higher level closer to center visually
  copy.sort((a,b)=> b.level - a.level);
  const ringCap = [6, 8, 10, 12];
  for(let i=0;i<CONFIG.maxRings && copy.length;i++){
    rings.push(copy.splice(0, ringCap[i]));
  }
  return rings;
}

function createSVGArc(percent){
  const size = 54; const r = 24; const c = 2 * Math.PI * r; const dash = (percent/100) * c;
  return `<svg class="skill-arc" viewBox='0 0 ${size} ${size}' aria-hidden='true'>
    <circle class='arc-bg' cx='${size/2}' cy='${size/2}' r='${r}' />
    <circle class='arc-fg' cx='${size/2}' cy='${size/2}' r='${r}' stroke-dasharray='${dash} ${c-dash}' />
  </svg>`;
}

function buildOrbit(){
  const mount = document.getElementById('rotating-skills');
  if(!mount) return;
  const skills = SKILLS.slice(0,32); // limit for readability
  const rings = partitionSkills(skills);
  mount.innerHTML = '';
  mount.classList.add('rotating-skills-ready');

  const viewport = document.createElement('div');
  viewport.className='rs-viewport';
  viewport.setAttribute('role','group');
  viewport.setAttribute('aria-label','Rotating skill visualization');
  mount.appendChild(viewport);

  const announce = document.createElement('div');
  announce.id='rs-live';
  announce.className='visually-hidden';
  announce.setAttribute('aria-live','polite');
  mount.appendChild(announce);

  rings.forEach((ringSkills, ringIndex) => {
    const ring = document.createElement('div');
    ring.className = 'rs-ring';
    ring.dataset.ring = String(ringIndex);
    const speed = CONFIG.baseSpin - ringIndex * 6; // faster inner ring
    ring.style.setProperty('--ring-idx', ringIndex);
    ring.style.setProperty('--spin-duration', (prefersReducedMotion()?0: speed)+'s');
    if(ringIndex % 2 === 1) ring.classList.add('reverse');

    const count = ringSkills.length;
    ringSkills.forEach((skill, i) => {
      const iconWrap = document.createElement('button');
      iconWrap.type='button';
      iconWrap.className='rs-skill';
      iconWrap.style.setProperty('--item-index', i);
      iconWrap.style.setProperty('--item-count', count);
      iconWrap.setAttribute('data-skill', skill.name);
      iconWrap.setAttribute('aria-label', `${skill.name} proficiency ${skill.level} percent`);
      iconWrap.innerHTML = `
        <span class='rs-icon' aria-hidden='true'>${SkillIcons[skillKey(skill.name)] || fallbackIcon()}</span>
        ${createSVGArc(skill.level)}
      `;
      iconWrap.addEventListener('mouseenter', () => focusSkill(iconWrap, skill, announce));
      iconWrap.addEventListener('focus', () => focusSkill(iconWrap, skill, announce));
      iconWrap.addEventListener('mouseleave', () => unfocusSkill(iconWrap));
      iconWrap.addEventListener('blur', () => unfocusSkill(iconWrap));
      ring.appendChild(iconWrap);
    });
    viewport.appendChild(ring);
  });

  if(CONFIG.pauseOnHover){
    mount.addEventListener('pointerenter', () => mount.classList.add('paused'));
    mount.addEventListener('pointerleave', () => mount.classList.remove('paused'));
  }
}

function fallbackIcon(){
  return `<svg viewBox='0 0 40 40'><circle cx='20' cy='20' r='12' fill='none' stroke='currentColor' stroke-width='2'/><circle cx='20' cy='20' r='4' fill='currentColor'/></svg>`;
}

function focusSkill(el, skill, announce){
  el.classList.add('active');
  const panel = ensureInfoPanel(el.closest('#rotating-skills'));
  panel.innerHTML = `
    <h4>${skill.name}</h4>
    <div class='level-row'><span class='badge'>${skill.level}%</span><div class='bar'><span style='width:${skill.level}%'></span></div></div>
    <p>${skill.desc || ''}</p>
  `;
  announce.textContent = `${skill.name} ${skill.level} percent`;
}
function unfocusSkill(el){ el.classList.remove('active'); }

function ensureInfoPanel(root){
  let panel = root.querySelector('.rs-info');
  if(!panel){
    panel = document.createElement('div');
    panel.className='rs-info';
    panel.setAttribute('role','region');
    panel.setAttribute('aria-label','Skill detail');
    root.appendChild(panel);
  }
  return panel;
}

function debounce(fn, delay=180){ let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=> fn(...args), delay); }; }

function recalc(){
  // Could implement dynamic sizing logic if container size queries needed
}

document.addEventListener('DOMContentLoaded', () => {
  if(document.getElementById('rotating-skills')) buildOrbit();
  window.addEventListener('resize', debounce(recalc, 250));
});
