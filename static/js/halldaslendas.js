gsap.registerPlugin(ScrollTrigger);

const eras = [
    { year: 1954, theme: 'theme-1954' },
    { year: 1974, theme: 'theme-1974' },
    { year: 1990, theme: 'theme-1990' },
    { year: 2014, theme: 'theme-2014' }
];

document.body.classList.add('theme-1954');

window.addEventListener('load', () => {
    eras.forEach((era) => {
        const section = document.querySelector(`#sec-${era.year}`);
        const slot = document.querySelector(`#slot-${era.year} .bust-placeholder`);

        if (!section || !slot) return;

        const textContent = section.querySelector('.text-content');
        const image = section.querySelector('.player-img');

        if (!image) return;

        // 1. Mudança de tema
        ScrollTrigger.create({
            trigger: section,
            start: "top 50%",
            end: "bottom 50%",
            onEnter: () => changeTheme(era.theme),
            onEnterBack: () => changeTheme(era.theme),
        });

        // 2. Animação de entrada do texto
        if (textContent) {
            gsap.to(textContent, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 70%",
                }
            });
        }

        // 3. Configuração do Clone
        // Criamos o clone uma única vez
        const clone = image.cloneNode(true);
        clone.classList.remove('player-img');
        clone.classList.add('player-clone');
        clone.removeAttribute('id');
        
        // Estilo inicial do clone (invisível e fixo)
        Object.assign(clone.style, {
            position: 'fixed',
            zIndex: "200",
            opacity: 0,
            pointerEvents: 'none',
            objectFit: 'cover',
            margin: 0,
            transformOrigin: 'center center'
        });
        document.body.appendChild(clone);

        // Função para pegar a posição RELATIVA À VIEWPORT (já que o clone é fixed)
        const getViewportRect = (el) => {
            return el.getBoundingClientRect();
        };

        // Timeline da animação
        gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "center center", 
                end: "bottom top", // Termina quando a seção sai por cima
                scrub: true,
                invalidateOnRefresh: true,
                onEnter: () => {
                    gsap.set(clone, { opacity: 1 });
                    gsap.set(image, { opacity: 0 });
                },
                onLeaveBack: () => {
                    gsap.set(clone, { opacity: 0 });
                    gsap.set(image, { opacity: 1 });
                }
            }
        })
        .fromTo(clone, {
            // Inicia exatamente onde a imagem está na tela naquele momento
            top: () => getViewportRect(image).top,
            left: () => getViewportRect(image).left,
            width: () => getViewportRect(image).width,
            height: () => getViewportRect(image).height,
            borderRadius: "12px"
        }, {
            // Vai para onde o slot (pedestal fixo) está na tela
            top: () => getViewportRect(slot).top,
            left: () => getViewportRect(slot).left,
            width: () => getViewportRect(slot).width,
            height: () => getViewportRect(slot).height,
            borderRadius: "8px",
            ease: "power1.inOut",
            immediateRender: false
        });
    });

    ScrollTrigger.refresh();
});

function changeTheme(newTheme) {
    eras.forEach(e => document.body.classList.remove(e.theme));
    document.body.classList.add(newTheme);
}

// Estrelas da seção final
const stars = document.querySelectorAll('.star');
if (stars.length > 0) {
    gsap.from(stars, {
        scale: 0,
        opacity: 0,
        rotation: 180,
        stagger: 0.2,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: '.finale-section',
            start: "top 60%",
        }
    });
}

// Recalcular ScrollTrigger se a janela mudar de tamanho
window.addEventListener('resize', () => ScrollTrigger.refresh());
