// ─── GOOGLE SHEETS ENDPOINT ───
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxFiqSce4jMTySez1q5T3usMnpuWZptUKS8BA5dcDZXWEYl2CQEs3VaLMC21lOC_dYt/exec';

function enviarASheet(data) {
  if (!SHEETS_URL) return;
  fetch(SHEETS_URL, {
    method: 'POST',
    body: JSON.stringify(data),
    mode: 'no-cors'
  }).catch(() => {});
}

// ─── NAVBAR SCROLL ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 60), { passive: true });

// ─── HAMBURGER / MOBILE MENU ───
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
hamburger.addEventListener('click',   () => mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
document.querySelectorAll('.mob-link').forEach(l =>
  l.addEventListener('click', () => mobileMenu.classList.remove('open'))
);


// ─── SCROLL REVEAL ───
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// ─── HERO MULTI-STEP FORM ───
const HF_DATA = {
  social:      { title: 'Evento Social',      subs: ['Boda', '15 Años', 'Primera Comunión', 'Cumpleaños'] },
  corporativo: { title: 'Evento Corporativo', subs: ['Reunión Empresarial', 'Conferencia', 'Fiesta Empresarial'] },
  cultural:    { title: 'Evento Cultural',    subs: ['Concierto', 'Feria de Exposición', 'Evento Religioso'] },
  otros:       { title: 'Otros Servicios',    subs: ['Alquiler de Equipos', 'Event Planner'] }
};

let hfStep = 1;
let hfCat  = '';
let hfSub  = '';

const hfPanels = {
  1: document.getElementById('hfP1'),
  2: document.getElementById('hfP2'),
  3: document.getElementById('hfP3'),
  4: document.getElementById('hfP4'),
};
const hfDots  = document.querySelectorAll('.hf-sdot');
const hfNavEl = document.getElementById('hfNav');
const hfBack  = document.getElementById('hfBack');
const hfNext  = document.getElementById('hfNext');
const hfSendB = document.getElementById('hfSend');

function hfAnimate(el) {
  el.style.animation = 'none';
  requestAnimationFrame(() => {
    el.style.animation = 'hfSlide .28s ease forwards';
  });
}

function hfRender() {
  Object.entries(hfPanels).forEach(([s, el]) => {
    const isActive = parseInt(s) === hfStep;
    el.hidden = !isActive;
    if (isActive) hfAnimate(el);
  });

  hfDots.forEach((d, i) => {
    const s = i + 1;
    d.classList.toggle('hf-active', s === hfStep);
    d.classList.toggle('hf-done',   s < hfStep);
  });

  hfNavEl.style.display = hfStep === 1 ? 'none' : 'flex';
  hfBack.style.display  = hfStep > 1           ? 'flex' : 'none';
  hfNext.style.display  = hfStep > 1 && hfStep < 4 ? 'flex' : 'none';
  hfSendB.style.display = hfStep === 4          ? 'flex' : 'none';
}

function hfGoTo(n) {
  hfStep = n;
  hfRender();
}

// Paso 1: selección de categoría → avanza automáticamente (solo form hero)
document.querySelectorAll('#cotizar-form .hf-cat').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#cotizar-form .hf-cat').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    hfCat = btn.dataset.cat;
    hfSub = '';

    const data = HF_DATA[hfCat];
    document.getElementById('hfP2Title').textContent = data.title + ' — ¿Cuál?';

    const wrap = document.getElementById('hfSubWrap');
    wrap.innerHTML = '';
    data.subs.forEach(s => {
      const b = document.createElement('button');
      b.className = 'hf-sub';
      b.textContent = s;
      b.addEventListener('click', () => {
        wrap.querySelectorAll('.hf-sub').forEach(x => x.classList.remove('sel'));
        b.classList.add('sel');
        hfSub = s;
        hfGoTo(3);
      });
      wrap.appendChild(b);
    });

    hfGoTo(2);
  });
});

hfBack.addEventListener('click', () => hfGoTo(hfStep - 1));

hfNext.addEventListener('click', () => {
  if (hfStep === 2 && !hfSub) return;
  if (hfStep < 4) hfGoTo(hfStep + 1);
});

hfSendB.addEventListener('click', () => {
  const nombre = document.getElementById('hfName').value  || 'Sin nombre';
  const tel    = document.getElementById('hfPhone').value || 'No indicado';
  const email  = document.getElementById('hfEmail').value || 'No indicado';
  const desc   = document.getElementById('hfDesc').value  || '';
  const lugar  = document.getElementById('hfPlace').value || 'No indicado';
  const fecha  = document.getElementById('hfDate').value  || 'Sin fecha';
  const pref   = (document.querySelector('input[name="hfContact"]:checked') || {}).value || 'WhatsApp';
  const evento = `${HF_DATA[hfCat]?.title || hfCat} — ${hfSub}`;

  const waText = encodeURIComponent(
    `Hola Damer Producciones! 👋\n\n` +
    `*Nueva solicitud de cotización*\n\n` +
    `📋 *Evento:* ${evento}\n` +
    `📝 *Descripción:* ${desc}\n` +
    `📍 *Lugar:* ${lugar}\n` +
    `📅 *Fecha:* ${fecha}\n\n` +
    `👤 *Nombre:* ${nombre}\n` +
    `📞 *Teléfono:* ${tel}\n` +
    `✉️ *Email:* ${email}\n` +
    `💬 *Contactar por:* ${pref}`
  );
  const hp          = document.getElementById('hfHp')?.value || '';
  const sheetParams = new URLSearchParams({ origen:'Hero', nombre, tel, email, evento, desc, lugar, fecha, pref, hp });
  const graciasUrl  = `gracias.html?wa=${encodeURIComponent('https://wa.me/573014734572?text=' + waText)}&${sheetParams.toString()}`;
  window.location.href = graciasUrl;
});

hfRender();

// ─── FORMULARIO CONTACTO (copia del hero) ───
let hf2Step = 1, hf2Cat = '', hf2Sub = '';
const hf2Panels = {
  1: document.getElementById('hf2P1'),
  2: document.getElementById('hf2P2'),
  3: document.getElementById('hf2P3'),
  4: document.getElementById('hf2P4'),
};
const hf2Dots  = document.querySelectorAll('#cotizar-form-2 .hf-sdot');
const hf2NavEl = document.getElementById('hf2Nav');
const hf2Back  = document.getElementById('hf2Back');
const hf2Next  = document.getElementById('hf2Next');
const hf2SendB = document.getElementById('hf2Send');

function hf2Render() {
  if (!hf2Panels[1]) return;
  Object.entries(hf2Panels).forEach(([s, el]) => {
    const isActive = parseInt(s) === hf2Step;
    el.hidden = !isActive;
    if (isActive) { el.style.animation='none'; requestAnimationFrame(() => { el.style.animation='hfSlide .28s ease forwards'; }); }
  });
  hf2Dots.forEach((d, i) => {
    d.classList.toggle('hf-active', i + 1 === hf2Step);
    d.classList.toggle('hf-done',   i + 1 < hf2Step);
  });
  hf2NavEl.style.display = hf2Step === 1 ? 'none' : 'flex';
  hf2Back.style.display  = hf2Step > 1           ? 'flex' : 'none';
  hf2Next.style.display  = hf2Step > 1 && hf2Step < 4 ? 'flex' : 'none';
  hf2SendB.style.display = hf2Step === 4          ? 'flex' : 'none';
}

document.querySelectorAll('.hf2-cat').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.hf2-cat').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    hf2Cat = btn.dataset.cat;
    hf2Sub = '';
    const data = HF_DATA[hf2Cat];
    document.getElementById('hf2P2Title').textContent = data.title + ' — ¿Cuál?';
    const wrap = document.getElementById('hf2SubWrap');
    wrap.innerHTML = '';
    data.subs.forEach(s => {
      const b = document.createElement('button');
      b.className = 'hf-sub';
      b.textContent = s;
      b.addEventListener('click', () => {
        wrap.querySelectorAll('.hf-sub').forEach(x => x.classList.remove('sel'));
        b.classList.add('sel');
        hf2Sub = s;
        hf2Step = 3; hf2Render();
      });
      wrap.appendChild(b);
    });
    hf2Step = 2; hf2Render();
  });
});

if (hf2Back) hf2Back.addEventListener('click', () => { hf2Step--; hf2Render(); });
if (hf2Next) hf2Next.addEventListener('click', () => { if (hf2Step === 2 && !hf2Sub) return; if (hf2Step < 4) { hf2Step++; hf2Render(); } });
if (hf2SendB) hf2SendB.addEventListener('click', () => {
  const nombre = document.getElementById('hf2Name').value  || 'Sin nombre';
  const tel    = document.getElementById('hf2Phone').value || 'No indicado';
  const email  = document.getElementById('hf2Email').value || 'No indicado';
  const desc   = document.getElementById('hf2Desc').value  || '';
  const lugar  = document.getElementById('hf2Place').value || 'No indicado';
  const fecha  = document.getElementById('hf2Date').value  || 'Sin fecha';
  const pref   = (document.querySelector('input[name="hf2Contact"]:checked') || {}).value || 'WhatsApp';
  const evento = `${HF_DATA[hf2Cat]?.title || hf2Cat} — ${hf2Sub}`;

  const waText = encodeURIComponent(
    `Hola Damer Producciones! 👋\n\n*Nueva solicitud de cotización*\n\n` +
    `📋 *Evento:* ${evento}\n` +
    `📝 *Descripción:* ${desc}\n📍 *Lugar:* ${lugar}\n📅 *Fecha:* ${fecha}\n\n` +
    `👤 *Nombre:* ${nombre}\n📞 *Teléfono:* ${tel}\n✉️ *Email:* ${email}\n💬 *Contactar por:* ${pref}`
  );
  const hp          = document.getElementById('hf2Hp')?.value || '';
  const sheetParams = new URLSearchParams({ origen:'Contacto', nombre, tel, email, evento, desc, lugar, fecha, pref, hp });
  const graciasUrl  = `gracias.html?wa=${encodeURIComponent('https://wa.me/573014734572?text=' + waText)}&${sheetParams.toString()}`;
  window.location.href = graciasUrl;
});

hf2Render();
