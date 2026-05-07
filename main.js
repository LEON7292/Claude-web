/* ════════════════════════════════════════════════
   BRINDA CLINIC — MAIN JS
   ════════════════════════════════════════════════ */

/* ── CLINIC CONFIG ── */
const CLINIC = {
  phone:    '+919476021494',
  whatsapp: '919476021494',
  email:    'info@brindaclinic.com',
};

/* ══════════════════════════════
   PAGE NAVIGATION
══════════════════════════════ */
const PAGES = ['home','about','services','team','contact'];

function showPage(name) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Show target
  const target = document.getElementById('page-' + name);
  if (target) target.classList.add('active');

  // Update nav links
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.dataset.page === name);
  });
  document.querySelectorAll('.mob-link').forEach(a => {
    a.classList.toggle('active', a.dataset.page === name);
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-init AOS for new page
  setTimeout(() => {
    AOS.refresh();
    // Run counter animation if going home
    if (name === 'home') runCounters();
  }, 100);
}

/* ══════════════════════════════
   MOBILE MENU
══════════════════════════════ */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

/* ══════════════════════════════
   NAV SCROLL EFFECT
══════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ══════════════════════════════
   LOADER
══════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    // Kick off counter animation after load
    runCounters();
  }, 1400);
});

/* ══════════════════════════════
   COUNTER ANIMATION
══════════════════════════════ */
let countersRun = false;
function runCounters() {
  if (countersRun) return;
  const nums = document.querySelectorAll('#page-home .stat-num[data-count]');
  if (!nums.length) return;
  countersRun = true;

  nums.forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
      const val = Math.round(eased * target);
      el.textContent = target >= 1000
        ? val.toLocaleString('en-IN') + '+'
        : val + (target > 5 ? '+' : '');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

/* ══════════════════════════════
   APPOINTMENT MODAL
══════════════════════════════ */
function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  // Reset to form state
  document.getElementById('modalBody').style.display = '';
  document.getElementById('modalSuccess').style.display = 'none';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

function submitModal() {
  const name    = document.getElementById('mname').value.trim();
  const phone   = document.getElementById('mphone').value.trim();
  const service = document.getElementById('mservice').value;
  const dt      = document.getElementById('mdatetime').value;
  const notes   = document.getElementById('mnotes').value.trim();

  if (!name || !phone) {
    showToast('Please enter your name and phone number.', 'error');
    return;
  }

  let msg = `Hello Brinda Clinic! I'd like to book an appointment.\n\n`;
  msg += `*Name:* ${name}\n`;
  msg += `*Phone:* ${phone}\n`;
  if (service) msg += `*Service:* ${service}\n`;
  if (dt) msg += `*Preferred time:* ${new Date(dt).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' })}\n`;
  if (notes) msg += `*Notes:* ${notes}\n`;

  window.open('https://wa.me/' + CLINIC.whatsapp + '?text=' + encodeURIComponent(msg), '_blank');

  // Show success state
  document.getElementById('modalBody').style.display = 'none';
  document.getElementById('modalSuccess').style.display = 'block';

  setTimeout(() => closeModal(), 3500);
}

/* ══════════════════════════════
   CONTACT FORM
══════════════════════════════ */
function sendForm() {
  const name  = document.getElementById('fname').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const msg   = document.getElementById('fmsg').value.trim();

  if (!name || !msg) {
    showToast('Please fill in your name and message.', 'error');
    return;
  }

  const text = `Hello Brinda Clinic!\n\n*Name:* ${name}\n*Phone:* ${phone || 'not provided'}\n*Message:* ${msg}`;
  window.open('https://wa.me/' + CLINIC.whatsapp + '?text=' + encodeURIComponent(text), '_blank');

  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('formSuccess').style.display  = 'block';
}

/* ══════════════════════════════
   CONTACT ACTIONS
══════════════════════════════ */
function callNow()  { window.location.href = 'tel:' + CLINIC.phone; }
function whatsapp() { window.open('https://wa.me/' + CLINIC.whatsapp, '_blank'); }

/* ══════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════ */
function showToast(msg, type = 'info') {
  // Remove existing toasts
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed; bottom:90px; left:50%; transform:translateX(-50%);
    background:${type === 'error' ? '#e74c3c' : '#2ecc71'};
    color:white; padding:14px 24px; border-radius:50px;
    font-family:'Outfit',sans-serif; font-size:14px; font-weight:500;
    z-index:9999; box-shadow:0 8px 24px rgba(0,0,0,0.2);
    animation:toast-in 0.35s ease;
    white-space:nowrap;
  `;
  const style = document.createElement('style');
  style.textContent = '@keyframes toast-in{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translateX(-50%)}}';
  document.head.appendChild(style);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ══════════════════════════════
   AOS INIT
══════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 650,
    once: true,
    offset: 60,
    easing: 'ease-out-cubic',
  });
});
