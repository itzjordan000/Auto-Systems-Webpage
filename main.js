// ── Nav scroll effect ──────────────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Hamburger menu ─────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── Scroll animations (IntersectionObserver) ───────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement.querySelectorAll('[data-animate]');
      let delay = 0;
      siblings.forEach((el, idx) => { if (el === entry.target) delay = idx * 80; });
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// ── Animated counters ──────────────────────────────────────────────────────────
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const duration = 1500;
      const start = performance.now();

      const animate = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);

        if (progress < 1) requestAnimationFrame(animate);
        else el.textContent = target;
      };

      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ── Terminal typewriter ────────────────────────────────────────────────────────
const sequences = [
  {
    cmd: 'bot start --name "AreoSystems"',
    output: [
      { text: '[OK] Connecting to Discord...', type: 'info', delay: 400 },
      { text: '[OK] MongoDB connected', type: 'success', delay: 800 },
      { text: '[OK] Registered 18 slash commands', type: 'success', delay: 1200 },
      { text: '[READY] AreoSystems#1234 is online', type: 'success', delay: 1600 },
    ]
  },
  {
    cmd: '/ticket create type:Support subject:"Need help"',
    output: [
      { text: '[TICKET] Channel created: #🟢-need-help-4a2f', type: 'info', delay: 400 },
      { text: '[TICKET] Staff notified', type: 'info', delay: 700 },
      { text: '[OK] Ticket #0042 opened', type: 'success', delay: 1000 },
    ]
  },
  {
    cmd: '/register client_name:"CoolBot" payment_amt:700',
    output: [
      { text: '[DB] Customer record created', type: 'info', delay: 400 },
      { text: '[ROLE] Customer role assigned', type: 'info', delay: 800 },
      { text: '[OK] CoolBot registered — next due 12/04/2026', type: 'success', delay: 1200 },
    ]
  }
];

let seqIndex = 0;
const cmdEl = document.getElementById('typedCmd');
const outputEl = document.getElementById('termOutput');

function typeSequence(seq) {
  const { cmd, output } = seq;
  cmdEl.textContent = '';
  outputEl.innerHTML = '';

  let i = 0;

  const typeInterval = setInterval(() => {
    cmdEl.textContent += cmd[i];
    i++;

    if (i >= cmd.length) {
      clearInterval(typeInterval);

      output.forEach(({ text, type, delay }) => {
        setTimeout(() => {
          const line = document.createElement('div');
          line.className = 'out-line ' + type;
          line.textContent = text;
          outputEl.appendChild(line);
        }, delay);
      });

      const totalDelay = output[output.length - 1].delay + 2000;

      setTimeout(() => {
        seqIndex = (seqIndex + 1) % sequences.length;
        typeSequence(sequences[seqIndex]);
      }, totalDelay);
    }
  }, 45);
}

// Start after a short delay
setTimeout(() => typeSequence(sequences[0]), 800);

// ── Smooth active nav link highlight ──────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = '';
        a.style.background = '';
        if (a.getAttribute('href') === '#' + entry.target.id) {
          a.style.color = 'var(--text)';
          a.style.background = 'rgba(255,255,255,0.05)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
