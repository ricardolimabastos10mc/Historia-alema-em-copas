const folder = document.querySelector(".folder-container");
const fotos = document.querySelectorAll(".photo");

folder.addEventListener("click", () => {
  folder.classList.toggle("open");

  if (!folder.classList.contains("open")) {
    fotos.forEach(f => {
      f.classList.remove("active");
      f.style.setProperty("--magnet-x", "0px");
      f.style.setProperty("--magnet-y", "0px");
    });
  }
});

fotos.forEach((foto) => {
  foto.addEventListener("click", (e) => {
    e.stopPropagation(); // não deixa o clique na foto fechar a pasta

    if (!folder.classList.contains("open")) return;

    if (foto.classList.contains("active")) {
      foto.classList.remove("active");
    } else {
      fotos.forEach(item => item.classList.remove("active"));
      foto.classList.add("active");
    }
  });

  foto.addEventListener("mousemove", (e) => {
    if (!folder.classList.contains("open")) return;
    const rect = foto.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.15;
    const offsetY = (e.clientY - centerY) * 0.15;
    foto.style.setProperty("--magnet-x", `${offsetX}px`);
    foto.style.setProperty("--magnet-y", `${offsetY}px`);
  });

  foto.addEventListener("mouseleave", () => {
    foto.style.setProperty("--magnet-x", "0px");
    foto.style.setProperty("--magnet-y", "0px");
  });
});

// ==========================================
// EFEITO 3D DA TAÇA DA COPA
// ==========================================
const container = document.getElementById('trophyCanvasContainer');

if (container) {
    // 1. Criar a Cena (O mundo 3D)
    const scene = new THREE.Scene();

    // 2. Criar a Câmara (Perspetiva do utilizador)
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5; // Distância da câmara para a taça

    // 3. Criar o Renderizador (Gera os gráficos com fundo transparente)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 4. Iluminação (Crucial para o reflexo metálico do ouro)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Luz geral do ambiente
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffdf7a, 1.8); // Luz dourada direcionada direta
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);
    
    const backLight = new THREE.DirectionalLight(0xffffff, 1.0); // Luz de contorno traseira
    backLight.position.set(-5, 3, -5);
    scene.add(backLight);

    // 5. Carregar o Modelo 3D Real (.glb ou .gltf)
    let tacaModel = null;
    const loader = new THREE.GLTFLoader();

    // AJUSTE AQUI: Confirma se o nome do teu ficheiro está exatamente igual ao caminho abaixo
    loader.load('/static/world_cup_trophy/scene.gltf', function(gltf) {
        tacaModel = gltf.scene;
        
        // Posicionamento e Escala (Ajusta os valores se a taça vier muito grande ou pequena)
        tacaModel.position.set(0, -0.1, 0); 
        tacaModel.scale.set(4.0, 4.0, 4.0); 
        
        scene.add(tacaModel);
    }, undefined, function(error) {
        console.error('Erro ao carregar o modelo 3D da taça:', error);
    });

    // 6. Rastreamento do Rato limitado ao Container com retorno ao centro
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let isHovered = false;

    // Detecta o movimento apenas quando o mouse está DENTRO do bloco da taça
    container.addEventListener('mousemove', (event) => {
        isHovered = true;
        const rect = container.getBoundingClientRect();
        
        // Calcula a posição do mouse relativa ao centro do próprio container
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        mouseX = (x / rect.width) * 2 - 1;
        mouseY = -(y / rect.height) * 2 + 1;
    });

    // Quando o mouse SAI do container, define o destino para o centro (0, 0)
    container.addEventListener('mouseleave', () => {
        isHovered = false;
        mouseX = 0;
        mouseY = 0;
    });

    // 7. Loop de Animação (Roda a 60 frames por segundo)
    function animate() {
        requestAnimationFrame(animate);

        if (tacaModel) {
            // Efeito "Lerp" para suavizar o movimento
            targetX += (mouseX - targetX) * 0.08;
            targetY += (mouseY - targetY) * 0.08;

            // Aplica a rotação baseada no rato
            tacaModel.rotation.y = targetX * 1.2;  // Rotação horizontal ampla
            tacaModel.rotation.x = -targetY * 0.6; // Rotação vertical controlada
        }

        renderer.render(scene, camera);
    }
    animate();
}

/* ============================================================
   TURBO DESIGN — efeitos novos adicionados por pedido do usuario
   Tudo em JS puro, sem bibliotecas externas.
============================================================ */

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1) Fundo interativo: constelação nas cores da Alemanha ---------- */
  const bgCanvas = document.getElementById("bgFx");
  if (bgCanvas) {
    const ctx = bgCanvas.getContext("2d");
    let w, h, particles = [];
    const colors = ["#f7c948", "#dd1f2d", "#ffffff"];
    const mouse = { x: null, y: null, radius: 150 };

    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    function countByScreen() {
      return window.innerWidth < 768 ? 45 : 95;
    }

    function resizeBg() {
      w = bgCanvas.width = window.innerWidth;
      h = bgCanvas.height = window.innerHeight;
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

    function stepBg() {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

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

      if (!reduceMotion) requestAnimationFrame(stepBg);
    }

    window.addEventListener("resize", () => {
      resizeBg();
      makeParticles();
    });

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      document.body.style.setProperty("--mx", e.clientX + "px");
      document.body.style.setProperty("--my", e.clientY + "px");
      document.body.classList.add("fx-active");

      // tilt 3D leve na taca e no card do hero
      [".trophy-frame", ".hero-visual .hero-card"].forEach((sel) => {
        const el = document.querySelector(sel);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (dist < 420) {
          const rotX = ((e.clientY - cy) / rect.height) * -6;
          const rotY = ((e.clientX - cx) / rect.width) * 6;
          el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        }
      });
    });

    window.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
      document.body.classList.remove("fx-active");
      document.querySelectorAll(".trophy-frame, .hero-visual .hero-card").forEach((el) => {
        el.style.transform = "";
      });
    });

    resizeBg();
    makeParticles();
    stepBg();
  }

  /* ---------- 2) Barra de progresso de leitura ---------- */
  const progressBar = document.querySelector(".scroll-progress");
  if (progressBar) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + "%";
    }, { passive: true });
  }

  /* ---------- 3) Ripple ao clicar nos botoes ---------- */
  document.querySelectorAll(".btn-main, .btn-ghost").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------- 4) Confete ao trocar o ano no disco das Copas ---------- */
  const cupRadios = document.querySelectorAll('input[name="germany_cup"]');
  const confettiColors = ["#f7c948", "#dd1f2d", "#111111", "#ffffff"];

  function burstConfetti(originEl) {
    if (reduceMotion) return;
    const rect = originEl.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    for (let i = 0; i < 26; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      const angle = Math.random() * Math.PI * 2;
      const distance = 90 + Math.random() * 160;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 40;
      piece.style.setProperty("--dx", dx + "px");
      piece.style.setProperty("--dy", dy + "px");
      piece.style.setProperty("--rot", Math.random() * 480 - 240 + "deg");
      piece.style.left = originX + "px";
      piece.style.top = originY + "px";
      piece.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      piece.style.animationDuration = 0.9 + Math.random() * 0.6 + "s";
      document.body.appendChild(piece);
      piece.addEventListener("animationend", () => piece.remove());
    }
  }

  cupRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const knob = document.querySelector(".cup-knob__center");
      if (knob) burstConfetti(knob);
    });
  });

  /* ---------- 5) Numeros contando ao aparecer na tela ---------- */
  const countTargets = document.querySelectorAll(".circle-progress span, .mini-stats strong");

  function animateCount(el) {
    const raw = el.textContent.trim();
    const target = parseInt(raw.replace(/\D/g, ""), 10);
    if (isNaN(target)) return;
    const suffix = raw.replace(/[0-9]/g, "");
    const duration = 1100;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
        el.classList.add("count-pop");
      }
    }
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window && countTargets.length) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    countTargets.forEach((el) => countObserver.observe(el));
  }

  /* ---------- 6) Entrada suave dos cards ao rolar a pagina ---------- */
  function initReveal() {
    const alvos = document.querySelectorAll(
      ".title-card, .game-table-card, .stat-card, .progress-panel, .curiosity-list article, .school-card"
    );
    alvos.forEach((el) => el.classList.add("reveal-fx"));

    if (!("IntersectionObserver" in window)) {
      alvos.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    alvos.forEach((el) => revealObserver.observe(el));
  }

  if (document.readyState !== "loading") {
    initReveal();
  } else {
    document.addEventListener("DOMContentLoaded", initReveal);
  }
})();

/* ============================================================
   CARD DO CELULAR — informacao aleatoria por ano da Copa
============================================================ */
(function () {
  const uivHello = document.getElementById("uivHello");
  if (!uivHello) return;

  const curiosidadesPorAno = {
    cup_1954: [
      "Milagre de Berna: a Alemanha venceu a favorita Hungria por 3 x 2 na final.",
      "Foi o primeiro titulo mundial da selecao alema.",
      "A final foi disputada debaixo de forte chuva, o que favoreceu as chuteiras alemas com travas removiveis."
    ],
    cup_1974: [
      "Titulo conquistado dentro de casa, com o torneio sediado na propria Alemanha.",
      "Franz Beckenbauer foi o capitao campeao daquela geracao.",
      "Na final, a Alemanha Ocidental superou a Holanda de Cruyff por 2 x 1."
    ],
    cup_1990: [
      "Ultimo titulo mundial antes da reunificacao da Alemanha.",
      "Beckenbauer se tornou campeao mundial tanto como jogador quanto como tecnico.",
      "Na final, a Alemanha Ocidental venceu a Argentina de Maradona por 1 x 0."
    ],
    cup_2014: [
      "Ficou marcado pelo historico 7 x 1 sobre o Brasil na semifinal.",
      "A Alemanha venceu a Argentina por 1 x 0 na final, com gol de Mario Gotze.",
      "Miroslav Klose se tornou o maior artilheiro da historia das Copas nesta edicao."
    ]
  };

  const uivCard = document.getElementById("uivCard");

  function mostrarCuriosidadeAleatoria(idAno) {
    const lista = curiosidadesPorAno[idAno];
    if (!lista) return;
    const texto = lista[Math.floor(Math.random() * lista.length)];
    const ano = idAno.replace("cup_", "");
    uivHello.classList.add("uiv-hello--info");
    uivHello.innerHTML = '<span class="uiv-hello__ano">' + ano + '</span>' + texto;

    if (uivCard) {
      uivCard.classList.remove("uiv-card--hidden");
      uivCard.classList.add("uiv-card--visible");
    }
  }

  document.querySelectorAll(".cup-knob label.cup-option").forEach((label) => {
    label.addEventListener("click", () => {
      const idAno = label.getAttribute("for");
      mostrarCuriosidadeAleatoria(idAno);
    });
  });
})();

/* ==========================================================================
   🌍 OS CAMINHOS DA GLORIA — Globo 3D premium com as sedes dos titulos
   ========================================================================== */

(function initPremiumGlobe() {
  const section = document.getElementById('caminhos-gloria');
  const globeContainer = document.getElementById('globe3d-container');
  if (!section || !globeContainer || typeof THREE === 'undefined') return;

  const tooltip = document.getElementById('globe-tooltip');
  const tooltipYear = document.getElementById('tooltip-year');
  const tooltipCity = document.getElementById('tooltip-city');
  const tooltipDesc = document.getElementById('tooltip-desc');
  const connector = document.getElementById('globe-connector');
  const connectorLine = document.getElementById('globe-connector-line');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cidades onde a Alemanha conquistou a Copa do Mundo
  const markerData = [
    { year: '🏆 1954', city: 'Berna — Suíça', desc: 'Primeira Copa conquistada.', lat: 46.948, lon: 7.4474, color: 0xf7c948 },
    { year: '🏆 1974', city: 'Munique — Alemanha', desc: 'Título conquistado em casa.', lat: 48.1351, lon: 11.582, color: 0xffffff },
    { year: '🏆 1990', city: 'Roma — Itália', desc: 'O tricampeonato mundial.', lat: 41.9028, lon: 12.4964, color: 0xf7c948 },
    { year: '🏆 2014', city: 'Rio de Janeiro — Brasil', desc: 'O histórico 7×1 antecedeu o tetracampeonato.', lat: -22.9068, lon: -43.1729, color: 0xffffff }
  ];

  /* ---------- Cena, camera e renderizador ---------- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, globeContainer.clientWidth / globeContainer.clientHeight, 0.1, 1000);
  camera.position.z = 240;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  globeContainer.appendChild(renderer.domElement);

  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  const R = 80;

  /* ---------- Conversor geografico -> coordenadas 3D ---------- */
  /* Substitua a função original por esta versão corrigida */
function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    return new THREE.Vector3(
      radius * Math.sin(phi) * Math.sin(theta), // Removido o sinal negativo (-)
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.cos(theta)
    );
}

  /* ---------- 1) Esfera estrutural: pontos fracos distribuidos uniformemente ---------- */
  (function buildSphereDots() {
    const positions = [];
    const latSteps = 55;
    const spacing = (Math.PI * R) / latSteps;
    for (let i = 0; i < latSteps; i++) {
      const phi = (i / (latSteps - 1)) * Math.PI;
      const rowRadius = R * Math.sin(phi);
      const lonSteps = Math.max(1, Math.floor((2 * Math.PI * rowRadius) / spacing));
      for (let j = 0; j < lonSteps; j++) {
        const theta = (j / lonSteps) * 2 * Math.PI;
        positions.push(-(rowRadius * Math.sin(theta)), R * Math.cos(phi), rowRadius * Math.cos(theta));
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.55, transparent: true, opacity: 0.16 });
    globeGroup.add(new THREE.Points(geo, mat));
  })();

  /* ---------- 2) Continentes: milhares de pontos amostrados de um mapa real ---------- */
  const landDotsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.05, transparent: true, opacity: 0 });

  function buildLandDots(isLand) {
    const positions = [];
    const latSteps = 170;
    const spacing = (Math.PI * R) / latSteps;
    for (let i = 0; i < latSteps; i++) {
      const lat = 90 - (i / (latSteps - 1)) * 180;
      const phi = (90 - lat) * (Math.PI / 180);
      const rowRadius = R * Math.sin(phi);
      const lonSteps = Math.max(1, Math.floor((2 * Math.PI * rowRadius) / spacing));
      for (let j = 0; j < lonSteps; j++) {
        const lon = (j / lonSteps) * 360 - 180;
        if (!isLand(lat, lon)) continue;
        const v = latLonToVector3(lat, lon, R);
        positions.push(
          v.x + (Math.random() - 0.5) * 0.5,
          v.y + (Math.random() - 0.5) * 0.5,
          v.z + (Math.random() - 0.5) * 0.5
        );
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    globeGroup.add(new THREE.Points(geo, landDotsMat));
  }

  (function loadLandMap() {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      const cw = 512, ch = 256;
      const cnv = document.createElement('canvas');
      cnv.width = cw;
      cnv.height = ch;
      const ctx = cnv.getContext('2d');
      ctx.drawImage(img, 0, 0, cw, ch);
      const data = ctx.getImageData(0, 0, cw, ch).data;

      const lum = (x, y) => {
        const k = (y * cw + x) * 4;
        return (data[k] + data[k + 1] + data[k + 2]) / 3;
      };

      const px = (lon) => Math.min(cw - 1, Math.max(0, Math.round(((lon + 180) / 360) * (cw - 1))));
      const py = (lat) => Math.min(ch - 1, Math.max(0, Math.round(((90 - lat) / 180) * (ch - 1))));

      // Detecta a polaridade do mapa amostrando pontos que sao terra com certeza:
      // centro da Africa, interior do Brasil, Asia central e centro dos EUA
      const probes = [[10, 20], [-10, -55], [45, 90], [40, -100]];
      let darkVotes = 0;
      probes.forEach(([lat, lon]) => {
        if (lum(px(lon), py(lat)) < 128) darkVotes++;
      });
      const landIsDark = darkVotes >= 3;

      buildLandDots((lat, lon) => {
        return landIsDark ? lum(px(lon), py(lat)) < 128 : lum(px(lon), py(lat)) >= 128;
      });
    };
    img.onerror = function () {
      console.error('[Globo] Falha ao carregar o mapa dos continentes.');
    };
    img.src = 'https://unpkg.com/three-globe/example/img/earth-water.png';
  })();

  /* ---------- 3) Contorno geometrico sutil ---------- */
  const wire = new THREE.Mesh(
    new THREE.SphereGeometry(R - 0.2, 28, 28),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.035 })
  );
  globeGroup.add(wire);

  /* ---------- 4) Marcadores luminosos das conquistas ---------- */
  // Textura radial gerada em canvas para o brilho dos marcadores
  function makeGlowTexture() {
    const size = 64;
    const cnv = document.createElement('canvas');
    cnv.width = cnv.height = size;
    const ctx = cnv.getContext('2d');
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255,255,255,0.9)');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.28)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(cnv);
  }

  const glowTexture = makeGlowTexture();
  const markers = [];

  markerData.forEach((data) => {
    const pos = latLonToVector3(data.lat, data.lon, R);
    const markerObj = new THREE.Group();
    markerObj.position.copy(pos);
    markerObj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
    markerObj.scale.set(0.0001, 0.0001, 0.0001); // nasce invisivel; entra um por um

    const pin = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: data.color })
    );
    markerObj.add(pin);

    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture,
      color: data.color,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    }));
    glow.scale.set(9, 9, 1);
    markerObj.add(glow);

    const halo = new THREE.Mesh(
      new THREE.RingGeometry(2.0, 2.6, 32),
      new THREE.MeshBasicMaterial({ color: data.color, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
    );
    halo.rotation.x = Math.PI / 2;
    markerObj.add(halo);

    globeGroup.add(markerObj);
    markers.push({ obj: markerObj, pin, halo, glow, data, rawPosition: pos, appear: 0, appearStart: -1, hoverScale: 1 });
  });

  /* ---------- 5) Particulas de fundo extremamente discretas ---------- */
  (function buildBackgroundDust() {
    const count = 70;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 620;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 620;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 220 - 120;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.9, transparent: true, opacity: 0.12 });
    scene.add(new THREE.Points(geo, mat));
  })();

  /* ---------- 6) Interacao: arrastar, hover e paralaxe ---------- */
  let isDragging = false;
  let isHovering = false;
  let previousMouse = { x: 0, y: 0 };
  const targetRotation = { x: 0.3, y: -0.8 };
  const currentRotation = { x: 0.3, y: -0.8 };
  const hoverOffset = { x: 0, y: 0 };
  const EASE = 0.08;

  const mouseParallax = { x: 0, y: 0 };
  const mouseNdc = new THREE.Vector2(-10, -10);

  function updatePointer(clientX, clientY) {
    const rect = globeContainer.getBoundingClientRect();
    const xNorm = ((clientX - rect.left) / rect.width) * 2 - 1;
    const yNorm = -((clientY - rect.top) / rect.height) * 2 + 1;
    mouseParallax.x = xNorm * 0.08;
    mouseParallax.y = yNorm * 0.08;
    mouseNdc.x = xNorm;
    mouseNdc.y = yNorm;
  }

  globeContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMouse = { x: e.clientX, y: e.clientY };
  });
  window.addEventListener('mouseup', () => { isDragging = false; });
  globeContainer.addEventListener('mouseenter', () => { isHovering = true; });
  globeContainer.addEventListener('mouseleave', () => {
    isHovering = false;
    mouseNdc.set(-10, -10);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      targetRotation.y += (e.clientX - previousMouse.x) * 0.005;
      targetRotation.x += (e.clientY - previousMouse.y) * 0.005;
      targetRotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotation.x));
      previousMouse = { x: e.clientX, y: e.clientY };
    }
    updatePointer(e.clientX, e.clientY);
  });

  // Toque: arrastar o globo com o dedo no celular
  globeContainer.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  globeContainer.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      targetRotation.y += (e.touches[0].clientX - previousMouse.x) * 0.008;
      targetRotation.x += (e.touches[0].clientY - previousMouse.y) * 0.008;
      targetRotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotation.x));
      previousMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  globeContainer.addEventListener('touchend', () => {
    isDragging = false;
    mouseNdc.set(-10, -10);
  });

  /* ---------- 7) Entrada da secao: titulo -> subtitulo -> globo -> marcadores ---------- */
  let markersRevealed = false;
  let sectionOnScreen = false;

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          section.classList.add('in-view');
          if (!markersRevealed) {
            markersRevealed = true;
            const baseDelay = prefersReducedMotion ? 0 : 1250;
            markers.forEach((m, i) => {
              setTimeout(() => { m.appearStart = performance.now(); }, baseDelay + i * 260);
            });
          }
          revealObserver.unobserve(section);
        }
      });
    }, { threshold: 0.2 });
    revealObserver.observe(section);

    // Pausa a renderizacao pesada quando a secao esta fora da tela
    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { sectionOnScreen = entry.isIntersecting; });
    }, { threshold: 0 });
    visibilityObserver.observe(section);
  } else {
    section.classList.add('in-view');
    sectionOnScreen = true;
    markersRevealed = true;
    markers.forEach((m) => { m.appearStart = performance.now(); });
  }

  /* ---------- 8) Tooltip + linha de conexao ---------- */
  let activeIndex = -1;

  function syncConnectorSize() {
    const parent = connector.parentElement;
    connector.setAttribute('width', parent.clientWidth);
    connector.setAttribute('height', parent.clientHeight);
    connector.setAttribute('viewBox', '0 0 ' + parent.clientWidth + ' ' + parent.clientHeight);
  }
  syncConnectorSize();

  function showTooltip(marker, xPix, yPix) {
    tooltipYear.textContent = marker.data.year;
    tooltipCity.textContent = marker.data.city;
    tooltipDesc.textContent = marker.data.desc;

    const areaW = globeContainer.clientWidth;
    const areaH = globeContainer.clientHeight;
    const tw = tooltip.offsetWidth;
    const th = tooltip.offsetHeight;

    // Preferencia: acima e a direita do marcador; recua se faltar espaco
    let left = xPix + 34;
    let top = yPix - th - 30;
    if (left + tw > areaW - 8) left = xPix - tw - 34;
    if (top < 8) top = yPix + 30;
    left = Math.max(8, Math.min(left, areaW - tw - 8));
    top = Math.max(8, Math.min(top, areaH - th - 8));

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.classList.add('active');

    // Linha luminosa: do marcador ate o ponto mais proximo da caixa
    const nearX = Math.max(left, Math.min(xPix, left + tw));
    const nearY = Math.max(top, Math.min(yPix, top + th));
    connectorLine.setAttribute('x1', xPix);
    connectorLine.setAttribute('y1', yPix);
    connectorLine.setAttribute('x2', nearX);
    connectorLine.setAttribute('y2', nearY);
    connector.classList.add('active');
  }

  function hideTooltip() {
    tooltip.classList.remove('active');
    connector.classList.remove('active');
  }

  /* ---------- 9) Loop de animacao (requestAnimationFrame, 60fps) ---------- */
  let pulse = 0;

  function easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function animate() {
    requestAnimationFrame(animate);
    if (!sectionOnScreen) return; // economiza GPU quando a secao esta fora da tela

    pulse += 0.045;

    // Rotacao automatica extremamente lenta (pausa ao interagir)
    if (!isDragging && !isHovering && !prefersReducedMotion) {
      targetRotation.y += 0.0016;
    }

    // Easing da rotacao + leve acompanhamento do mouse no hover
    const wantHoverX = isHovering && !isDragging ? -mouseNdc.y * 0.05 : 0;
    const wantHoverY = isHovering && !isDragging ? mouseNdc.x * 0.1 : 0;
    hoverOffset.x += (wantHoverX - hoverOffset.x) * 0.04;
    hoverOffset.y += (wantHoverY - hoverOffset.y) * 0.04;

    currentRotation.y += (targetRotation.y - currentRotation.y) * EASE;
    currentRotation.x += (targetRotation.x - currentRotation.x) * EASE;
    globeGroup.rotation.y = currentRotation.y + hoverOffset.y;
    globeGroup.rotation.x = currentRotation.x + hoverOffset.x;

    // Paralaxe suave da camera
    camera.position.x += (mouseParallax.x * 14 - camera.position.x) * 0.05;
    camera.position.y += (mouseParallax.y * 14 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Fade-in dos pontos dos continentes junto com a entrada da secao
    if (markersRevealed && landDotsMat.opacity < 0.8) {
      landDotsMat.opacity = Math.min(0.8, landDotsMat.opacity + 0.012);
    }

    // Entrada dos marcadores um por um + pulsacao continua + hover
    const now = performance.now();
    let active = null;

    markers.forEach((m, i) => {
      if (m.appearStart >= 0 && m.appear < 1) {
        m.appear = Math.min(1, (now - m.appearStart) / 620);
      }
      const appearScale = m.appear > 0 ? easeOutBack(m.appear) : 0.0001;

      const haloPulse = 1 + Math.sin(pulse * 2.2 + i * 1.4) * 0.28;
      m.halo.scale.set(haloPulse, haloPulse, 1);
      m.halo.material.opacity = (0.72 - (haloPulse - 0.72) * 0.42) * m.appear;
      m.glow.material.opacity = (0.55 + Math.sin(pulse * 2.2 + i * 1.4) * 0.25) * m.appear;

      // Hover: projeta o marcador na tela e mede a distancia ate o mouse
      const globalPos = m.rawPosition.clone().applyMatrix4(globeGroup.matrixWorld);
      const screenPos = globalPos.clone().project(camera);
      const dist = Math.hypot(screenPos.x - mouseNdc.x, screenPos.y - mouseNdc.y);

      let want = 1;
      if (dist < 0.09 && m.appear >= 1) {
        const camDir = new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion);
        if (globalPos.clone().normalize().dot(camDir) > 0.3) {
          want = 1.5;
          active = { m, screenPos, index: i };
        }
      }
      m.hoverScale += (want - m.hoverScale) * 0.15;
      const s = appearScale * m.hoverScale;
      m.obj.scale.set(s, s, s);
    });

    if (active) {
      const xPix = (active.screenPos.x * 0.5 + 0.5) * globeContainer.clientWidth;
      const yPix = (-(active.screenPos.y * 0.5) + 0.5) * globeContainer.clientHeight;
      if (activeIndex !== active.index) {
        connector.classList.remove('active');
        void connector.getBoundingClientRect(); // reinicia a animacao do traco
        activeIndex = active.index;
      }
      showTooltip(active.m, xPix, yPix);
      globeContainer.style.cursor = 'pointer';
    } else {
      if (activeIndex !== -1) {
        activeIndex = -1;
        hideTooltip();
      }
      globeContainer.style.cursor = '';
    }

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    const w = globeContainer.clientWidth;
    const h = globeContainer.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    syncConnectorSize();
  });

  animate();
})();
// Seleciona todos os itens de conquista
const medalItems = document.querySelectorAll(".medal-item");

medalItems.forEach(item => {
  item.addEventListener("mousemove", (e) => {
    // Pega a posição do mouse em relação ao item
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left; // x relativo ao item
    const y = e.clientY - rect.top;  // y relativo ao item

    // Calcula uma inclinação leve baseada na posição do mouse
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    // Aplica o movimento
    item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  // Reseta quando o mouse sai
  item.addEventListener("mouseleave", () => {
    item.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
  });
});
