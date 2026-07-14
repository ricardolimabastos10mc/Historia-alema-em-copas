/* =========================================================
   EFEITO DE FUNDO INTERATIVO — Constelação + Brilho do Mouse
   JS puro, sem bibliotecas. Cole antes do </body>, depois do script.js
   ========================================================= */

(function () {
  const canvas = document.getElementById("bgFx");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // brilho que segue o mouse
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  let w, h, particles = [];
  const colors = ["#f7c948", "#dd1f2d", "#ffffff"];
  const mouse = { x: null, y: null, radius: 150 };

  function countByScreen() {
    return window.innerWidth < 768 ? 45 : 95;
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function makeParticles() {
    const total = countByScreen();
    particles = [];
    for (let i = 0; i < total; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // partículas fogem/reagem perto do cursor
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius && dist > 0.01) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / dist) * force * 2.4;
          p.y += (dy / dist) * force * 2.4;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.55;
      ctx.fill();

      // liga particulas proximas com linhas finas (efeito "constelação")
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = "rgba(247,201,72," + (1 - dist / 120) * 0.28 + ")";
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    if (!reduceMotion) requestAnimationFrame(step);
  }

  window.addEventListener("resize", () => {
    resize();
    makeParticles();
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    document.body.style.setProperty("--mx", e.clientX + "px");
    document.body.style.setProperty("--my", e.clientY + "px");
    document.body.classList.add("fx-active");

    // parallax leve no card do hero
    const card = document.querySelector(".hero-visual .hero-card");
    if (card) {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rotX = ((e.clientY - cy) / rect.height) * -6;
      const rotY = ((e.clientX - cx) / rect.width) * 6;
      if (Math.abs(e.clientX - cx) < rect.width && Math.abs(e.clientY - cy) < rect.height) {
        card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }
    }
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
    document.body.classList.remove("fx-active");
  });

  // animação de entrada ao rolar a pagina (sem biblioteca, so IntersectionObserver)
  function initReveal() {
    const alvos = document.querySelectorAll(
      ".title-card, .game-table-card, .stat-card, .progress-panel, .curiosity-list article, .school-card"
    );
    alvos.forEach((el) => el.classList.add("reveal-fx"));

    if (!("IntersectionObserver" in window)) {
      alvos.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    alvos.forEach((el) => obs.observe(el));
  }

  resize();
  makeParticles();
  step();
  document.addEventListener("DOMContentLoaded", initReveal);
  if (document.readyState !== "loading") initReveal();
})();