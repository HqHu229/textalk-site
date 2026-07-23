// Gedeelde mobiele navigatie voor de subpagina's.
// Bouwt een hamburger + fullscreen-menu op uit de bestaande desktop-nav, zodat
// je op mobiel overal kunt navigeren. Progressive enhancement: faalt dit script,
// dan blijft de pagina gewoon werken (de "Kom langs"-knop staat er nog).
(function () {
  function init() {
    // Home heeft al een eigen mobiel menu — niet dubbel doen.
    if (document.getElementById("mobileMenu")) return;
    var header = document.querySelector("header");
    if (!header) return;
    var bar = header.querySelector("div");
    var desktopNav = header.querySelector("nav");
    if (!bar || !desktopNav) return;

    // Links uit de desktop-nav overnemen (knoppen zoals "Kom langs" apart houden).
    var links = [], ctaHref = "agenda.html", ctaText = "Kom langs";
    Array.prototype.forEach.call(desktopNav.querySelectorAll("a"), function (a) {
      var href = a.getAttribute("href") || "#";
      var text = (a.textContent || "").trim();
      if (a.className.indexOf("btn") !== -1) { ctaHref = href; ctaText = text; }
      else links.push({ href: href, text: text });
    });

    // Bestaande losse mobiele CTA verbergen (die zit al in het menu).
    var mobileCta = header.querySelector(".xl\\:hidden");
    if (mobileCta) mobileCta.style.display = "none";

    // Hamburgerknop.
    var btn = document.createElement("button");
    btn.className = "xl:hidden p-2";
    btn.setAttribute("aria-label", "Menu openen");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = '<svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 7h22M2 13h22M2 19h22"/></svg>';
    bar.appendChild(btn);

    // Fullscreen-overlay.
    var mm = document.createElement("div");
    mm.id = "mobileMenu";
    mm.className = "fixed inset-0 z-50 hidden flex-col justify-between p-6 text-white";
    mm.style.background = "#000";
    var itemsHtml = links.map(function (l) {
      return '<a style="font-size:clamp(1.8rem,8vw,2.8rem);font-weight:700;letter-spacing:-.02em;line-height:1" href="' + l.href + '">' + l.text + "</a>";
    }).join("");
    mm.innerHTML =
      '<div class="flex items-center justify-between">' +
        '<a href="index.html" class="logo-pill text-xl"><span class="logo-tex">tex</span><span class="logo-talk">talk</span></a>' +
        '<button id="mmClose" class="p-2" aria-label="Menu sluiten"><svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4l18 18M22 4L4 22"/></svg></button>' +
      "</div>" +
      '<nav class="flex flex-col gap-3" aria-label="Mobiele navigatie">' + itemsHtml + "</nav>" +
      '<a class="btn justify-center" style="background:#fff;color:#000;border-color:#fff" href="' + ctaHref + '">' + ctaText + " →</a>";
    document.body.appendChild(mm);

    function open() { mm.classList.remove("hidden"); mm.classList.add("flex"); btn.setAttribute("aria-expanded", "true"); }
    function close() { mm.classList.add("hidden"); mm.classList.remove("flex"); btn.setAttribute("aria-expanded", "false"); }
    btn.addEventListener("click", open);
    mm.querySelector("#mmClose").addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
