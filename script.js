// ── Draw Meta Ads Manager icon on canvas ──
window.addEventListener('load', () => {
  const c = document.getElementById('appIconCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  const s = 88;
  const r = 18;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(s - r, 0);
  ctx.quadraticCurveTo(s, 0, s, r);
  ctx.lineTo(s, s - r);
  ctx.quadraticCurveTo(s, s, s - r, s);
  ctx.lineTo(r, s);
  ctx.quadraticCurveTo(0, s, 0, s - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.clip();
  const g = ctx.createLinearGradient(0, 0, s, s);
  g.addColorStop(0, '#0084ff');
  g.addColorStop(0.45, '#00c6ff');
  g.addColorStop(1, '#00d97e');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  const cx = 44;
  const cy = 46;
  const aw = 28;
  const ah = 22;
  ctx.moveTo(cx, cy - ah / 2 - 4);
  ctx.lineTo(cx + aw / 2, cy + ah / 2 - 4);
  ctx.lineTo(cx + aw / 4, cy + ah / 2 - 4);
  ctx.lineTo(cx + aw / 4, cy + ah / 2 + 8);
  ctx.lineTo(cx - aw / 4, cy + ah / 2 + 8);
  ctx.lineTo(cx - aw / 4, cy + ah / 2 - 4);
  ctx.lineTo(cx - aw / 2, cy + ah / 2 - 4);
  ctx.closePath();
  ctx.fill();
});

window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width;
    });
  }, 300);
});

let installed = false;

function getApkUrl() {
  const queryPath = new URLSearchParams(window.location.search).get('apk');
  if (queryPath) return new URL(queryPath, window.location.href).href;

  const primaryInstallBtn = document.getElementById('installBtn');
  const dataPath = primaryInstallBtn ? primaryInstallBtn.dataset.apkPath : '';
  if (dataPath) return new URL(dataPath, window.location.href).href;

  const metaPath = document.querySelector('meta[name="apk-path"]')?.content;
  if (metaPath) return new URL(metaPath, window.location.href).href;

  return new URL('assets/downloads/app-release.apk', window.location.href).href;
}

function triggerApkDownload(apkUrl) {
  const downloadLink = document.createElement('a');
  downloadLink.href = apkUrl;
  downloadLink.download = 'app-release.apk';
  downloadLink.rel = 'noopener noreferrer';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
}

function handleInstall() {
  const apkUrl = getApkUrl();
  const btns = document.querySelectorAll('.install-btn');
  installed = !installed;
  btns.forEach(btn => {
    if (installed) {
      btn.textContent = 'Uninstall';
      btn.classList.add('installed');
      showToast('Đang tải file APK...');
      triggerApkDownload(apkUrl);
    } else {
      btn.textContent = 'Install';
      btn.classList.remove('installed');
      showToast('App uninstalled.');
    }
  });
}

function handleShare(e) {
  e.preventDefault();
  if (navigator.share) {
    navigator.share({ title: 'Meta Ads Manager', url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('Link copied to clipboard!');
    });
  }
}

let wishlisted = false;
function handleWishlist(e) {
  e.preventDefault();
  wishlisted = !wishlisted;
  showToast(wishlisted ? 'Added to wishlist!' : 'Removed from wishlist.');
}

let expanded = false;
function toggleAbout() {
  expanded = !expanded;
  const txt = document.getElementById('aboutText');
  const btn = document.getElementById('readMoreBtn');
  txt.classList.toggle('collapsed', !expanded);
  btn.textContent = expanded ? 'less' : 'more';
}

const NUM_SS = 5;
let lbIndex = 0;

function buildDots() {
  const d = document.getElementById('lbDots');
  d.innerHTML = '';
  for (let i = 0; i < NUM_SS; i++) {
    const dot = document.createElement('div');
    dot.className = 'lb-dot' + (i === lbIndex ? ' active' : '');
    d.appendChild(dot);
  }
}

function openLightbox(idx) {
  lbIndex = idx;
  const lb = document.getElementById('lightbox');
  lb.classList.add('open');
  renderLightbox();
  buildDots();
}

function renderLightbox() {
  const screen = document.getElementById('lightboxScreen');
  const mockup = document.querySelectorAll('.phone-mockup')[lbIndex];
  const img = mockup ? mockup.querySelector('img') : null;
  screen.innerHTML = '';
  if (img) {
    const i = document.createElement('img');
    i.src = img.src;
    i.alt = img.alt;
    i.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;border-radius:28px;';
    screen.appendChild(i);
  }
  document.querySelectorAll('.lb-dot').forEach((d, i) => {
    d.classList.toggle('active', i === lbIndex);
  });
}

function lbNavigate(dir) {
  lbIndex = (lbIndex + dir + NUM_SS) % NUM_SS;
  renderLightbox();
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'ArrowLeft') lbNavigate(-1);
  if (e.key === 'ArrowRight') lbNavigate(1);
  if (e.key === 'Escape') closeLightbox();
});

function markHelpful(btn) {
  btn.style.borderColor = 'var(--green)';
  btn.style.color = 'var(--green)';
  showToast('Thanks for your feedback!');
}

function switchTab(el, name) {
  document.querySelectorAll('.bn-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  showToast(`Browsing ${name}`);
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}
