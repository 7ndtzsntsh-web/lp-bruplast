// Animações de entrada. Quem pediu menos animação no sistema vê tudo parado.
var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (window.AOS) {
  AOS.init({ once: true, offset: 60, duration: 800, easing: 'ease-out-cubic', disable: calmo });
} else {
  // O arquivo de animação não carregou: mostra tudo parado em vez de deixar a página em branco.
  document.documentElement.classList.add('sem-animacao');
}
if (calmo) document.documentElement.classList.add('sem-animacao');

// Menu do topo mais escuro depois de rolar a página.
var menu = document.querySelector('.menu-topo');
function aoRolar() {
  if (menu) menu.classList.toggle('rolou', window.scrollY > 40);
}
// Lê a rolagem no próximo quadro (ler logo depois de mudar classes força o navegador a recalcular a página).
var agendado = false;
window.addEventListener('scroll', function () {
  if (agendado) return;
  agendado = true;
  requestAnimationFrame(function () { agendado = false; aoRolar(); });
}, { passive: true });
requestAnimationFrame(aoRolar);

// Menu do celular: abre e fecha no botão, e fecha ao escolher uma seção.
var botaoMenu = document.getElementById('botao-menu');
var menuCelular = document.getElementById('menu-celular');
function fecharMenu() {
  if (!menuCelular) return;
  menuCelular.classList.add('hidden');
  botaoMenu.setAttribute('aria-expanded', 'false');
  botaoMenu.setAttribute('aria-label', 'Abrir menu');
}
if (botaoMenu && menuCelular) {
  botaoMenu.addEventListener('click', function () {
    var abrir = menuCelular.classList.contains('hidden');
    menuCelular.classList.toggle('hidden', !abrir);
    botaoMenu.setAttribute('aria-expanded', abrir ? 'true' : 'false');
    botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
  });
  menuCelular.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', fecharMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') fecharMenu();
  });
}

// Números que contam até o valor quando aparecem na tela. O número certo já está escrito no HTML:
// sem script (ou com menos animação), aparece direto o valor final.
// Anos de mercado: calculado pela data de fundação (21/05/2001), para não ficar desatualizado.
// O HTML já traz o número certo para hoje; aqui ele só acompanha a passagem dos anos.
document.querySelectorAll('[data-desde]').forEach(function (el) {
  var p = el.getAttribute('data-desde').split('-');
  var hoje = new Date();
  var anos = hoje.getFullYear() - Number(p[0]);
  if (hoje.getMonth() + 1 < Number(p[1]) || (hoje.getMonth() + 1 === Number(p[1]) && hoje.getDate() < Number(p[2]))) anos--;
  if (anos > Number(el.getAttribute('data-contar'))) {
    el.setAttribute('data-contar', String(anos));
    el.textContent = String(anos);
  }
});

var numeros = document.querySelectorAll('[data-contar]');
if (!calmo && 'IntersectionObserver' in window && numeros.length) {
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      observador.unobserve(entrada.target);
      var el = entrada.target;
      var fim = Number(el.getAttribute('data-contar'));
      var sufixo = el.getAttribute('data-sufixo') || '';
      var inicio = performance.now();
      var duracao = 1400;
      (function passo(agora) {
        var t = Math.min(1, (agora - inicio) / duracao);
        var suave = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(fim * suave) + sufixo;
        if (t < 1) requestAnimationFrame(passo);
      })(inicio);
    });
  }, { threshold: 0.6 });
  numeros.forEach(function (el) {
    el.textContent = '0' + (el.getAttribute('data-sufixo') || '');
    observador.observe(el);
  });
}

// Imagens não podem ser arrastadas. O CSS e o draggable="false" já resolvem na maioria dos
// navegadores; isto cobre os que ignoram os dois.
document.addEventListener('dragstart', function (e) {
  if (e.target && e.target.tagName === 'IMG') e.preventDefault();
});

// Botão "Copiar" ao lado do e-mail: funciona mesmo em computador sem programa de e-mail configurado
// (aí o link mailto: não abre nada, e parecia que o e-mail "não ia").
function copiarTexto(texto) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(texto);
  return new Promise(function (ok, falha) {
    var area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.className = 'fixed opacity-0 pointer-events-none';
    document.body.appendChild(area);
    area.select();
    var deu = false;
    try { deu = document.execCommand('copy'); } catch (e) { deu = false; }
    document.body.removeChild(area);
    if (deu) ok(); else falha();
  });
}
document.querySelectorAll('[data-copiar]').forEach(function (botao) {
  var original = botao.textContent;
  botao.addEventListener('click', function () {
    copiarTexto(botao.getAttribute('data-copiar')).then(function () {
      botao.textContent = 'Copiado!';
    }, function () {
      botao.textContent = 'Selecione e copie';
    }).then(function () {
      setTimeout(function () { botao.textContent = original; }, 2200);
    });
  });
});
