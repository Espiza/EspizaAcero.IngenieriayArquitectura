/* ══════════════════════════════════════════
   ESPIZA ACERO — site.js
   Lee los archivos de la carpeta /data y arma
   las partes comunes de todas las páginas.
══════════════════════════════════════════ */
(function () {
  const Espiza = {};

  /* ── Utilidades ── */
  Espiza.esc = (t) =>
    String(t == null ? '' : t).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Texto simple → HTML seguro. **negrita** y saltos de línea.
  Espiza.fmt = (t) =>
    Espiza.esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

  // Las rutas del panel pueden venir como "/img/x.jpg"; las hacemos relativas.
  Espiza.ruta = (p) => (p ? String(p).replace(/^\/+/, '') : '');

  Espiza.cargar = (url) =>
    fetch(url, { cache: 'no-cache' }).then((r) => {
      if (!r.ok) throw new Error(url + ' → ' + r.status);
      return r.json();
    });

  Espiza.wa = (texto) =>
    'https://wa.me/' + Espiza.sitio.whatsapp + '?text=' + encodeURIComponent(texto || '');

  // Imagen con respaldo: si no existe la foto, muestra un recuadro.
  Espiza.img = (src, alt, clase) => {
    const i = document.createElement('img');
    if (clase) i.className = clase;
    i.alt = alt || '';
    i.src = Espiza.ruta(src);
    i.addEventListener('error', () => {
      const v = document.createElement('div');
      v.className = 'img-vacia ' + (clase || '');
      v.textContent = '📷 Sin foto';
      i.replaceWith(v);
    });
    return i;
  };

  /* ── Partes comunes ── */
  function topbar(s) {
    return `
      <a href="${Espiza.esc(s.facebook)}" target="_blank" rel="noopener" title="Facebook"><i class="fab fa-facebook"></i> Facebook</a>
      <a href="${Espiza.esc(s.instagram)}" target="_blank" rel="noopener" title="Instagram"><i class="fab fa-instagram"></i> Instagram</a>`;
  }

  function nav(s, m, paginaActual) {
    const logo = s.logo
      ? `<img src="${Espiza.esc(Espiza.ruta(s.logo))}" alt="${Espiza.esc(s.nombre)}" class="logo-img">`
      : `${Espiza.esc(s.nombre)} <span>| ${Espiza.esc(s.subtitulo)}</span>`;
    const menus = m.menus.map((g) => {
      const activo = g.items.some((i) => i.pagina === paginaActual) ? ' class="active"' : '';
      const items = g.items
        .map((i) => `<a href="producto.html?p=${encodeURIComponent(i.pagina)}">${Espiza.esc(i.nombre)}</a>`)
        .join('');
      return `<li><a href="#"${activo}>${Espiza.esc(g.titulo)} ▾</a><div class="dropdown">${items}</div></li>`;
    }).join('');
    const proyectosActivo = paginaActual === 'proyectos' ? ' class="active"' : '';
    return `
      <div class="logo"><a href="index.html" style="text-decoration:none;color:inherit;">${logo}</a></div>
      <ul class="nav-links">
        ${menus}
        <li><a href="proyectos.html"${proyectosActivo}>Proyectos</a></li>
        <li><a href="index.html#contacto">Contáctanos</a></li>
      </ul>`;
  }

  function footer(s, m) {
    const productos = m.menus
      .map((g) => g.items[0] ? `<li><a href="producto.html?p=${encodeURIComponent(g.items[0].pagina)}">${Espiza.esc(g.titulo)}</a></li>` : '')
      .join('');
    return `
      <div>
        <h4>${Espiza.esc(s.nombre)} | ${Espiza.esc(s.subtitulo)}</h4>
        <p style="font-size:13px;color:#888;line-height:1.6;">${Espiza.fmt(s.frase_footer)}</p>
        <div class="footer-social" style="margin-top:16px;">
          <a href="${Espiza.esc(s.facebook)}" class="social-btn" target="_blank" rel="noopener"><i class="fab fa-facebook"></i> Facebook</a>
          <a href="${Espiza.esc(s.instagram)}" class="social-btn" target="_blank" rel="noopener"><i class="fab fa-instagram"></i> Instagram</a>
        </div>
      </div>
      <div><h4>Nosotros</h4><ul><li><a href="proyectos.html">Proyectos</a></li></ul></div>
      <div><h4>Productos</h4><ul>${productos}</ul></div>
      <div>
        <h4>Contacto</h4>
        <ul>
          <li><a href="tel:+${Espiza.esc(s.whatsapp)}">📞 ${Espiza.esc(s.telefono)}</a></li>
          <li><a href="index.html#contacto">✉️ Formulario de contacto</a></li>
          <li><a href="https://wa.me/${Espiza.esc(s.whatsapp)}" target="_blank" rel="noopener"><i class="fab fa-whatsapp" style="color:#25d366;"></i> WhatsApp</a></li>
        </ul>
      </div>`;
  }

  function whatsapp(s) {
    return `
      <div class="wa-popup" id="waPopup">
        <div class="wa-header">
          <div class="wa-header-left">
            <div class="wa-logo-icon"><i class="fab fa-whatsapp" style="color:#25d366;font-size:22px;"></i></div>
            <h4>WhatsApp</h4>
          </div>
          <button class="wa-close" id="waCerrar" aria-label="Cerrar">✕</button>
        </div>
        <div class="wa-body"><div class="wa-bubble">${Espiza.fmt(s.mensaje_burbuja_whatsapp)}</div></div>
        <a href="${Espiza.esc(Espiza.wa(s.mensaje_inicial_whatsapp))}" class="wa-btn-chat" target="_blank" rel="noopener">
          <i class="fab fa-whatsapp"></i> Abrir chat
        </a>
      </div>
      <button class="wa-float" id="waAbrir" title="WhatsApp" aria-label="WhatsApp">
        <i class="fab fa-whatsapp" style="font-size:28px;color:#fff;"></i>
      </button>`;
  }

  /* ── Visor de fotos (lightbox) ── */
  Espiza.visor = (() => {
    let fotos = [], actual = 0, el;
    function crear() {
      el = document.createElement('div');
      el.className = 'lightbox';
      el.innerHTML = `
        <button class="lightbox-close" aria-label="Cerrar">✕</button>
        <button class="lightbox-nav lightbox-prev" aria-label="Anterior">&#8249;</button>
        <img alt="">
        <p class="lightbox-caption"></p>
        <button class="lightbox-nav lightbox-next" aria-label="Siguiente">&#8250;</button>`;
      document.body.appendChild(el);
      el.addEventListener('click', (e) => { if (e.target === el) cerrar(); });
      el.querySelector('.lightbox-close').addEventListener('click', cerrar);
      el.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); mover(-1); });
      el.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); mover(1); });
      document.addEventListener('keydown', (e) => {
        if (!el.classList.contains('open')) return;
        if (e.key === 'Escape') cerrar();
        if (e.key === 'ArrowLeft') mover(-1);
        if (e.key === 'ArrowRight') mover(1);
      });
    }
    function pintar() {
      el.querySelector('img').src = Espiza.ruta(fotos[actual].src);
      el.querySelector('.lightbox-caption').textContent = fotos[actual].texto || '';
    }
    function cerrar() { el.classList.remove('open'); }
    function mover(d) { actual = (actual + d + fotos.length) % fotos.length; pintar(); }
    return {
      abrir(lista, i) { if (!el) crear(); fotos = lista; actual = i; pintar(); el.classList.add('open'); }
    };
  })();

  /* ── Arranque común ── */
  Espiza.iniciar = function (paginaActual) {
    return Promise.all([Espiza.cargar('data/sitio.json'), Espiza.cargar('data/menu.json')]).then(([s, m]) => {
      Espiza.sitio = s;
      Espiza.menu = m;

      document.getElementById('topbar').innerHTML = topbar(s);
      document.getElementById('nav').innerHTML = nav(s, m, paginaActual);
      document.getElementById('footer').innerHTML = footer(s, m);
      document.getElementById('footer-bottom').textContent = s.copyright;

      const w = document.getElementById('whatsapp');
      w.innerHTML = whatsapp(s);
      const popup = document.getElementById('waPopup');
      document.getElementById('waAbrir').addEventListener('click', () => popup.classList.toggle('open'));
      document.getElementById('waCerrar').addEventListener('click', () => popup.classList.remove('open'));
      setTimeout(() => popup.classList.add('open'), 3000);

      // Menú en celular: tocar para abrir/cerrar
      document.querySelectorAll('.nav-links > li').forEach((li) => {
        const a = li.querySelector(':scope > a');
        if (li.querySelector('.dropdown')) {
          a.addEventListener('click', (e) => {
            e.preventDefault();
            const abierto = li.classList.contains('open');
            document.querySelectorAll('.nav-links > li.open').forEach((x) => x.classList.remove('open'));
            if (!abierto) li.classList.add('open');
          });
        }
      });

      // Botón subir
      const subir = document.getElementById('scrollTop');
      if (subir) {
        window.addEventListener('scroll', () => { subir.style.display = window.scrollY > 300 ? 'block' : 'none'; });
        subir.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
      }
      return s;
    });
  };

  Espiza.errorPagina = (contenedor, msg) => {
    contenedor.innerHTML = `<div class="aviso-error">${Espiza.esc(msg)}</div>`;
  };

  window.Espiza = Espiza;
})();
