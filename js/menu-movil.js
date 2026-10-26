(function () {
  var MQ = window.matchMedia('(max-width: 768px)');

  function montar(nav) {
    var lista = nav.querySelector('.nav-links') || nav.querySelector('ul');
    if (!lista || nav.querySelector('.nav-toggle')) return false;
    lista.classList.add('nav-links');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-toggle';
    btn.setAttribute('aria-label', 'Abrir menú');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '☰';
    nav.insertBefore(btn, lista);

    function cerrarSubmenus() {
      lista.querySelectorAll('li.open').forEach(function (li) { li.classList.remove('open'); });
    }
    function cerrarTodo() {
      lista.classList.remove('active');
      cerrarSubmenus();
      btn.innerHTML = '☰';
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', function () {
      var abierto = lista.classList.toggle('active');
      if (!abierto) cerrarSubmenus();
      btn.innerHTML = abierto ? '✕' : '☰';
      btn.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });

    lista.addEventListener('click', function (e) {
      if (!MQ.matches) return;
      var a = e.target.closest('a');
      if (!a) return;
      var li = a.closest('.nav-links > li');
      var sub = li && li.querySelector('.dropdown');
      var esTitulo = sub && !sub.contains(a);

      if (esTitulo) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var yaAbierto = li.classList.contains('open');
        cerrarSubmenus();
        if (!yaAbierto) li.classList.add('open');
      } else {
        cerrarTodo();
      }
    }, true);

    document.addEventListener('click', function (e) {
      if (MQ.matches && !nav.contains(e.target)) cerrarTodo();
    });
    var alCambiar = function () { if (!MQ.matches) cerrarTodo(); };
    if (MQ.addEventListener) MQ.addEventListener('change', alCambiar);
    else MQ.addListener(alCambiar);
    return true;
  }

  function iniciar() {
    var nav = document.getElementById('nav');
    if (!nav || montar(nav)) return;
    var obs = new MutationObserver(function () {
      if (montar(nav)) obs.disconnect();
    });
    obs.observe(nav, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();