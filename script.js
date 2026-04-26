/* ============================================================
   Mukanzu Royd | Portfolio — script.js
   ============================================================ */

/* ---- PRELOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 1900);
});

/* ---- CUSTOM CURSOR ---- */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

(function animRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .tech-item, .project-card, .filter-tab, .social-btn')
  .forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });

/* ---- SCROLL EVENTS ---- */
window.addEventListener('scroll', () => {

  /* Scroll progress bar */
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('scroll-progress').style.width = scrolled + '%';

  /* Back to top button */
  document.getElementById('back-top').classList.toggle('visible', window.scrollY > 400);

  /* Sticky header */
  document.getElementById('main-header').classList.toggle('scrolled', window.scrollY > 50);

  /* Active nav link highlighting */
  const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
  sections.forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const top    = sec.offsetTop - 100;
    const bottom = top + sec.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) link.classList.add('active');
    }
  });
});

/* ---- HERO CANVAS PARTICLE NETWORK ---- */
const canvas = document.getElementById('hero-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLE_COUNT = 80;
const particles = [];

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.vx    = (Math.random() - 0.5) * 0.4;
    this.vy    = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.r     = Math.random() * 1.5 + 0.5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,229,255,${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,229,255,${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animParticles);
}
animParticles();

/* ---- TYPING EFFECT ---- */
const phrases = [
  'Mukanzu Royd',
  'Full-Stack Web Developer',
  'Systems Programmer',
  'Psycho-Social Counselor',
  'Youth Advocate & Humanitarian',
  'Problem Solver 🚀'
];

let phraseIdx = 0, charIdx = 0, deleting = false, pause = false;
const typedEl = document.getElementById('typed-text');

function typeLoop() {
  if (pause) { setTimeout(typeLoop, 1400); pause = false; return; }
  const current = phrases[phraseIdx];

  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) { pause = true; deleting = true; }
    setTimeout(typeLoop, 65);
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
    setTimeout(typeLoop, 35);
  }
}
setTimeout(typeLoop, 2200);

/* ---- SCROLL REVEAL (IntersectionObserver) ---- */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

/* ---- ANIMATED COUNTERS ---- */
const counters = document.querySelectorAll('.stat-number[data-target]');
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el     = e.target;
    const target = +el.dataset.target;
    let current  = 0;
    const step   = Math.ceil(target / 50);
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + (target === 100 ? '%' : '+');
      if (current >= target) clearInterval(timer);
    }, 30);
    countObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => countObs.observe(c));

/* ---- SKILL BARS ---- */
const skillBars = document.querySelectorAll('.skill-bar-fill');
const barObs    = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.pct + '%';
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
skillBars.forEach(b => barObs.observe(b));

/* ---- PROJECT FILTER ---- */
document.querySelectorAll('.filter-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.opacity       = show ? '1'       : '0.2';
      card.style.transform     = show ? ''        : 'scale(0.95)';
      card.style.pointerEvents = show ? ''        : 'none';
    });
  });
});

/* ---- HAMBURGER / MOBILE MENU ---- */
const ham       = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    ham.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---- CONTACT FORM ---- */
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = this.querySelector('.form-submit');
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  btn.disabled  = true;
  setTimeout(() => {
    document.getElementById('contact-form').style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  }, 1600);
});

/* ---- BACK TO TOP ---- */
document.getElementById('back-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
