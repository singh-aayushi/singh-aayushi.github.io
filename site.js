(function () {
  /* ---------- mux nav: mark current input, light up its path through the gates ---------- */
  const here = location.pathname.split("/").pop() || "index.html";
  let code = null;
  document.querySelectorAll(".mux-inputs a").forEach(a => {
    const target = a.getAttribute("href").split("/").pop();
    if (target === here) {
      a.setAttribute("aria-current", "page");
      code = a.dataset.code;
    }
  });
  if (code === null) return;
  // Every wire, gate, and junction in the diagram carries data-on = the select codes
  // (S1 S0) for which it is part of the live path. Turn on the ones matching this page.
  document.querySelectorAll(".mx [data-on]").forEach(el => {
    if (el.dataset.on.split(" ").includes(code)) el.classList.add("on");
  });
})();
