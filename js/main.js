document.addEventListener('DOMContentLoaded', () => {
  // Menú móvil
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  menuToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('#navLinks a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  // Modal de bienvenida (con bloqueo de scroll para evitar saltos de barra lateral)
  const introModal = document.getElementById('introModal');
  const closeIntro = () => {
    introModal?.classList.add('hidden');
    introModal?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };
  document.getElementById('closeModal')?.addEventListener('click', closeIntro);
  document.getElementById('enterSite')?.addEventListener('click', closeIntro);

  // Copiar ID de distribuidor
  const copyId = document.getElementById('copyId');
  const memberId = document.getElementById('memberId');
  copyId?.addEventListener('click', async () => {
    const text = memberId.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
      const prev = copyId.textContent;
      copyId.textContent = 'ID copiado ✓';
      setTimeout(() => copyId.textContent = prev, 1800);
    } catch (e) {
      alert('Copia manualmente el ID: ' + text);
    }
  });

  // Animación Reveal en Scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Carrusel Bloque 1
  const track = document.getElementById('carouselTrack');
  const dots = [...document.querySelectorAll('#carouselDots button')];
  let slideIndex = 0;
  const total = dots.length;

  function renderSlides() {
    if (!track || !total) return;
    track.style.transform = 'translateX(-' + (slideIndex * 100) + '%)';
    dots.forEach((d, i) => d.classList.toggle('active', i === slideIndex));
  }
  document.getElementById('prevSlide')?.addEventListener('click', () => {
    slideIndex = (slideIndex - 1 + total) % total;
    renderSlides();
  });
  document.getElementById('nextSlide')?.addEventListener('click', () => {
    slideIndex = (slideIndex + 1) % total;
    renderSlides();
  });
  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    slideIndex = i;
    renderSlides();
  }));
  if (total) setInterval(() => {
    slideIndex = (slideIndex + 1) % total;
    renderSlides();
  }, 5000);

  // Hero Slider Principal
  const heroTrack = document.getElementById('heroSliderTrack');
  const heroDots = [...document.querySelectorAll('#heroSliderDots button')];
  let heroIndex = 0;

  function renderHero() {
    if (!heroTrack || !heroDots.length) return;
    heroTrack.style.transform = 'translateX(-' + (heroIndex * 100) + '%)';
    heroDots.forEach((d, i) => d.classList.toggle('active', i === heroIndex));
  }
  heroDots.forEach((dot, i) => dot.addEventListener('click', () => {
    heroIndex = i;
    renderHero();
  }));
  if (heroTrack && heroDots.length) {
    setInterval(() => {
      heroIndex = (heroIndex + 1) % heroDots.length;
      renderHero();
    }, 4600);
  }

  // Modal de Descargo de Responsabilidad
  const disclaimerModal = document.getElementById('disclaimerModal');
  function openDisclaimer() {
    disclaimerModal?.classList.remove('hidden');
    disclaimerModal?.setAttribute('aria-hidden', 'false');
  }
  function closeDisclaimer() {
    disclaimerModal?.classList.add('hidden');
    disclaimerModal?.setAttribute('aria-hidden', 'true');
  }
  document.querySelectorAll('.open-disclaimer').forEach(btn => btn.addEventListener('click', openDisclaimer));
  document.getElementById('closeDisclaimer')?.addEventListener('click', closeDisclaimer);
  document.getElementById('cancelDisclaimer')?.addEventListener('click', closeDisclaimer);
  document.getElementById('acceptDisclaimer')?.addEventListener('click', () => {
    closeDisclaimer();
    document.getElementById('testimonios')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.querySelector('#disclaimerModal .disclaimer-backdrop')?.addEventListener('click', closeDisclaimer);

  // =========================================================================
  // ASISTENTE IA ESPECIALIZADO (Base de conocimiento cerrada y anti-desvío)
  // =========================================================================
  const demoChatLog = document.getElementById('demoChatLog');
  const demoChatForm = document.getElementById('demoChatForm');
  const demoChatInput = document.getElementById('demoChatInput');

  const KNOWLEDGE_BASE = [
    {
      keywords: ['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos', 'quien eres'],
      weight: 1,
      answer: '¡Hola! Soy el asistente virtual de Dr. Glutatión & MOM Cisteína. Puedo orientarte sobre cómo elevar tus niveles de glutatión, los beneficios de Immunocal, el respaldo científico (PubMed, PDR, CPS), protocolos de consumo o cómo comprar con el ID 1472439 (25% de descuento). ¿Qué te gustaría saber?'
    },
    {
      keywords: ['glutation', 'glutatión', 'molecula maestra', 'antioxidante', 'radicales libres', 'estres oxidativo', 'para que sirve'],
      weight: 3,
      answer: 'El glutatión es la "molécula maestra" antioxidante que producen tus propias células. Cumple 4 funciones vitales (IDEA): fortalece el sistema Inmunológico, Desintoxica órganos (especialmente el hígado), protege las mitocondrias generando más Energía celular y neutraliza los radicales libres frenando el estrés oxidativo.'
    },
    {
      keywords: ['cisteina', 'cisteína', 'bioactiva', 'calostro', 'leche materna', 'aminoacido', 'absorcion'],
      weight: 3,
      answer: 'El glutatión no se absorbe bien si se toma directamente; tus células necesitan fabricarlo internamente usando un aminoácido clave llamado cisteína bioactiva. Esta se encuentra de forma natural en la leche materna y, en forma consolidada y protegida para sobrevivir a la digestión, en Immunocal.'
    },
    {
      keywords: ['regular', 'platinum', 'azul', 'gris', 'verde', 'booster', 'diferencia', 'tipos', 'presentacion'],
      weight: 4,
      answer: '• Immunocal Regular (caja azul): cisteína bioactiva pura consolidada, apta para todas las edades (incluyendo niños y embarazadas bajo supervisión médica) para fortalecer el sistema inmune.\n• Immunocal Platinum (caja gris): añade minerales alcalinizantes (CMP) y creatina (RMF), ideal para adultos mayores, deportistas y procesos de recuperación muscular o desgaste crónico.\n• Immunocal Booster (verde): potencializador antioxidante con sulforafano que multiplica la activación celular.'
    },
    {
      keywords: ['immunocal', 'que es', 'suplemento', 'proteina', 'suero', 'leche', 'intolerante', 'lactosa'],
      weight: 2,
      answer: 'Immunocal es un aislado de proteína de suero no desnaturalizado desarrollado en Canadá tras más de 40 años de investigación médica. Está clínicamente comprobado para elevar los niveles de glutatión intracelular. Contiene menos del 1% de lactosa, por lo que suele ser bien tolerado. Es un complemento nutricional y no sustituye tratamientos médicos.'
    },
    {
      keywords: ['posologia', 'dosis', 'sobres', 'como se toma', 'preparar', 'protocolo', 'mes', 'ayunas', 'licuadora'],
      weight: 3,
      answer: 'En protocolos intensivos referenciales se inicia con 6 sobres diarios en el Mes 1 (2 antes del desayuno, 2 a las 11:00 AM y 2 a las 5:00 PM), pasando luego a 4 sobres (Meses 5-6) y 3 sobres en ayunas para mantenimiento desde el Mes 7.\n\n⚠️ Importante en su preparación: Nunca uses agua caliente ni licuadora eléctrica, ya que el calor y la fricción rompen los enlaces de cisteína. Mézclalo únicamente en su vaso agitador con líquido frío o al clima.'
    },
    {
      keywords: ['pubmed', 'evidencia', 'estudio', 'cientific', 'nobel', 'pdr', 'cps', 'libro', 'bounous', 'montagnier', 'verdad', 'funciona'],
      weight: 3,
      answer: 'Immunocal cuenta con más de 45 años de investigación iniciada por el Dr. Gustavo Bounous y la Dra. Patricia Kongshavn en la Universidad McGill (Canadá). Aparece en el vademécum médico de EE. UU. (PDR) y el compendio farmacéutico de Canadá (CPS), además de contar con decenas de estudios indexados en PubMed y ser analizado en el capítulo 42 del libro editado por el Premio Nobel Dr. Luc Montagnier.'
    },
    {
      keywords: ['id', 'comprar', 'compra', 'descuento', 'precio', 'costo', 'tienda', 'adquirir', 'pedir', '25%'],
      weight: 4,
      answer: 'Puedes adquirir Immunocal directamente en la tienda oficial de Immunotec con un 25% de descuento utilizando el ID de distribuidor: 1472439.\n\nSi deseas acompañamiento personalizado para tu pedido en Colombia, EE. UU., México, España u otros países, puedes escribir directamente al WhatsApp de Alberto Hoyos (+57 314 580 7239).'
    },
    {
      keywords: ['cancer', 'quimio', 'quimioterapia', 'enfermedad', 'tratamiento', 'diabetes', 'parkinson', 'autoinmune', 'cura', 'medico'],
      weight: 4,
      answer: 'Por ética médica y rigor científico, Immunocal no se presenta como cura de ninguna enfermedad ni reemplaza tratamientos médicos como quimioterapia, radioterapia o fármacos. Su función es ser un complemento nutricional de alto valor biológico que eleva el glutatión para respaldar el sistema inmune y la recuperación celular junto a las indicaciones de tu médico tratante.'
    },
    {
      keywords: ['whatsapp', 'contacto', 'asesor', 'alberto', 'telefono', 'llamar', 'call center'],
      weight: 3,
      answer: 'Puedes comunicarte directamente con el distribuidor autorizado Alberto Hoyos al WhatsApp +57 314 580 7239 (usando el botón verde flotante en la esquina inferior derecha) o consultar los teléfonos de Call Center oficiales de Immunotec en el pie de esta página.'
    }
  ];

  function demoNormalize(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function demoAnswer(question) {
    const q = demoNormalize(question);
    let bestMatch = null;
    let highestScore = 0;

    for (const item of KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of item.keywords) {
        if (q.includes(demoNormalize(kw))) {
          score += item.weight;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item.answer;
      }
    }

    if (bestMatch && highestScore > 0) {
      return bestMatch;
    }

    // Bloqueo estricto para temas fuera de contexto
    return 'Mi especialidad es orientarte exclusivamente sobre el glutatión, la cisteína bioactiva, Immunocal, su respaldo científico y cómo adquirirlo con el 25% de descuento (ID 1472439).\n\n¿Te gustaría saber cómo actúa en tus defensas, cómo se prepara o cómo realizar tu pedido?';
  }

  function demoAddMessage(text, who) {
    if (!demoChatLog) return;
    const div = document.createElement('div');
    div.className = 'demo-msg ' + who;
    div.textContent = text;
    demoChatLog.appendChild(div);
    demoChatLog.scrollTop = demoChatLog.scrollHeight;
  }

  function demoAsk(q) {
    const question = (q || '').trim();
    if (!question) return;
    demoAddMessage(question, 'user');
    setTimeout(() => demoAddMessage(demoAnswer(question), 'bot'), 280);
  }

  demoChatForm?.addEventListener('submit', e => {
    e.preventDefault();
    const q = demoChatInput?.value || '';
    if (demoChatInput) demoChatInput.value = '';
    demoAsk(q);
  });

  document.querySelectorAll('[data-demo-q]').forEach(btn => btn.addEventListener('click', () => demoAsk(btn.getAttribute('data-demo-q'))));

  // =========================================================================
  // MINIATURAS INTELIGENTES PARA VIDEOS DE YOUTUBE (EVITA ERROR 153 Y ACELERA CARGA)
  // =========================================================================
  document.querySelectorAll('.video-card iframe').forEach(iframe => {
    const src = iframe.getAttribute('src') || '';
    const match = src.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (!match) return;

    const videoId = match[1];
    const title = iframe.getAttribute('title') || 'Reproducir video';

    const facade = document.createElement('div');
    facade.className = 'yt-facade';
    facade.setAttribute('role', 'button');
    facade.setAttribute('tabindex', '0');
    facade.setAttribute('aria-label', 'Reproducir: ' + title);

    const thumb = document.createElement('img');
    thumb.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    thumb.alt = title;
    thumb.loading = 'lazy';

    const playBtn = document.createElement('span');
    playBtn.className = 'yt-play-btn';

    const badge = document.createElement('span');
    badge.className = 'yt-badge';
    badge.textContent = '▶ Ver video';

    facade.append(thumb, playBtn, badge);

    const activateVideo = () => {
      // Si se abre en local (file://), abre en pestaña nueva para evitar Error 153 de YouTube
      if (window.location.protocol === 'file:') {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank', 'noopener');
        return;
      }
      const newIframe = document.createElement('iframe');
      newIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      newIframe.title = title;
      newIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      newIframe.allowFullscreen = true;
      facade.replaceWith(newIframe);
    };

    facade.addEventListener('click', activateVideo);
    facade.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateVideo();
      }
    });

    iframe.replaceWith(facade);
  });
});