/* =========================
   PREFERÊNCIA DE MOVIMENTO
   Se a pessoa pediu menos animação no sistema,
   nada de partículas, digitação ou tilt 3D.
========================= */

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const isTouch = window.matchMedia("(hover: none)").matches;


/* =========================
   EFEITO DE DIGITAÇÃO
========================= */

const typingElement = document.getElementById("typing");

const phrases = [
    "Desenvolvedor de Software",
    "Apps web e mobile",
    "React · TypeScript · Node.js",
    "Profissional de TI"
];

if (typingElement) {

    if (reduceMotion) {

        // Mostra a primeira frase inteira, sem animar
        typingElement.textContent = phrases[0];

    } else {

        let phraseIndex = 0;
        let characterIndex = 0;
        let deleting = false;

        const typeEffect = () => {

            // Aba em segundo plano: espera, não gasta CPU à toa
            if (document.hidden) {
                setTimeout(typeEffect, 500);
                return;
            }

            const currentPhrase = phrases[phraseIndex];

            if (!deleting) {

                typingElement.textContent =
                    currentPhrase.substring(0, characterIndex + 1);

                characterIndex++;

                if (characterIndex === currentPhrase.length) {
                    deleting = true;
                    setTimeout(typeEffect, 1800);
                    return;
                }

            } else {

                typingElement.textContent =
                    currentPhrase.substring(0, characterIndex - 1);

                characterIndex--;

                if (characterIndex === 0) {
                    deleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                }

            }

            setTimeout(typeEffect, deleting ? 45 : 80);

        };

        typeEffect();

    }

}


/* =========================
   PARTÍCULAS
========================= */

const particleContainer = document.getElementById("particles");

if (particleContainer && !reduceMotion) {

    // Menos partículas em telas pequenas (economia de bateria)
    const total = window.innerWidth < 800 ? 18 : 45;

    // Um fragmento só = um reflow, em vez de 45
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < total; i++) {

        const particle = document.createElement("div");

        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 8 + "s";
        particle.style.animationDuration = 5 + Math.random() * 8 + "s";

        fragment.appendChild(particle);

    }

    particleContainer.appendChild(fragment);

}


/* =========================
   SCROLL REVEAL
========================= */

const revealObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Já apareceu: para de observar
                revealObserver.unobserve(entry.target);
            }

        });

    },
    { threshold: 0.15 }

);

document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
});


/* =========================
   MENU MOBILE
========================= */

const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

if (navToggle && navLinks) {

    const setMenu = (open) => {
        navLinks.classList.toggle("open", open);
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.setAttribute(
            "aria-label",
            open ? "Fechar menu" : "Abrir menu"
        );
    };

    navToggle.addEventListener("click", () => {
        setMenu(!navLinks.classList.contains("open"));
    });

    // Fecha ao escolher uma seção ou ao apertar Esc
    navLinks.addEventListener("click", (event) => {
        if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setMenu(false);
    });

}


/* =========================
   SEÇÃO ATIVA NO MENU
========================= */

const sections = document.querySelectorAll("main section[id]");

const menuLinks = new Map(
    [...document.querySelectorAll('.nav-links a[href^="#"]')].map(
        (link) => [link.getAttribute("href").slice(1), link]
    )
);

if (sections.length && menuLinks.size) {

    const spy = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                const link = menuLinks.get(entry.target.id);
                if (!link || !entry.isIntersecting) return;

                menuLinks.forEach((other) =>
                    other.classList.remove("current")
                );

                link.classList.add("current");

            });

        },
        { rootMargin: "-40% 0px -55% 0px" }

    );

    sections.forEach((section) => spy.observe(section));

}


/* =========================
   EFEITO 3D (CARD DE CÓDIGO E DEMAIS CARDS)
   Só em telas com mouse — no toque o transform
   inline travava o estado de hover.
========================= */

function applyTilt(element, intensity, lift) {

    let frame = null;

    element.addEventListener("mousemove", (event) => {

        if (frame) return;

        frame = requestAnimationFrame(() => {

            frame = null;

            const rect = element.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            element.style.transform =
                `translateY(${lift}px) ` +
                `rotateX(${-y * intensity}deg) ` +
                `rotateY(${x * intensity}deg)`;

        });

    });

    element.addEventListener("mouseleave", () => {
        element.style.transform = "";
    });

}

if (!isTouch && !reduceMotion) {

    const codeWindow = document.querySelector(".code-window");

    if (codeWindow) {
        applyTilt(codeWindow, 8, 0);
    }

    document
        .querySelectorAll(".skill-card")
        .forEach((card) => applyTilt(card, 5, -8));

}


/* =========================
   ANO DO RODAPÉ
========================= */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}
