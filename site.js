(function () {
  /* ---------- mux nav: mark current input, light up its path through the gates ---------- */
  const here = location.pathname.split("/").pop() || "index.html";
  let code = null;
  let name = "";
  document.querySelectorAll(".mux-inputs a").forEach(a => {
    const href = a.getAttribute("href");
    const target = href === "/" ? "index.html" : href.split("/").pop();
    if (target === here) {
      a.setAttribute("aria-current", "page");
      code = a.dataset.code;
      name = a.dataset.name;
    }
  });
  if (code !== null) {
    // Every wire, gate, and junction in the diagram carries data-on = the select codes
    // (S1 S0) for which it is part of the live path. Turn on the ones matching this page.
    document.querySelectorAll(".mx [data-on]").forEach(el => {
      if (el.dataset.on.split(" ").includes(code)) el.classList.add("on");
    });
  }

  /* ---------- narrow screens: collapse the mux behind a toggle showing the current select ---------- */
  const side = document.querySelector("aside.side");
  const nav = document.querySelector("nav.mux");
  if (!side || !nav) return;

  // Wrap the nav so its height can animate via grid-template-rows.
  const panel = document.createElement("div");
  panel.className = "mux-panel";
  panel.id = "mux-panel";
  nav.parentNode.insertBefore(panel, nav);
  panel.appendChild(nav);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "mux-toggle";
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", "mux-panel");
  btn.innerHTML =
    '<span class="code">' + (code ?? "--") + "</span>" +
    '<span class="name">' + (name || "menu") + "</span>" +
    '<svg class="glyph" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M3 6l5 5 5-5"/>' +
    "</svg>";
  side.insertBefore(btn, panel);

  const setOpen = open => {
    side.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
  };
  btn.addEventListener("click", () => setOpen(!side.classList.contains("open")));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && side.classList.contains("open")) {
      setOpen(false);
      btn.focus();
    }
  });
  document.addEventListener("click", e => {
    if (side.classList.contains("open") && !side.contains(e.target)) setOpen(false);
  });
  // Leaving mobile width: make sure the panel is not left in a collapsed state.
  const mq = window.matchMedia("(max-width: 760px)");
  mq.addEventListener("change", () => { if (!mq.matches) setOpen(false); });
})();