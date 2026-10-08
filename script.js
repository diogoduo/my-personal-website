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
   EFEITO 3D NOS CARDS DE HABILIDADES
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


/* =========================
   GALERIA DE IMAGENS DOS PROJETOS
   As imagens de cada projeto ficam num <template>
   no index.html (id="galeria-...").
========================= */

const gallery = document.getElementById("gallery");

if (gallery && typeof gallery.showModal === "function") {

    const titleElement = gallery.querySelector(".gallery-title");
    const counterElement = gallery.querySelector(".gallery-counter");
    const imageElement = gallery.querySelector(".gallery-image");
    const captionTitle = gallery.querySelector(".gallery-caption strong");
    const captionText = gallery.querySelector(".gallery-caption span");
    const thumbsElement = gallery.querySelector(".gallery-thumbs");

    let items = [];
    let current = 0;

    const show = (index) => {

        current = (index + items.length) % items.length;

        const item = items[current];

        imageElement.width = item.width;
        imageElement.height = item.height;
        imageElement.src = item.src;
        imageElement.alt = item.alt;

        captionTitle.textContent = item.title;
        captionText.textContent = item.alt;
        counterElement.textContent = `${current + 1} / ${items.length}`;

        thumbsElement.querySelectorAll("button").forEach((thumb, i) => {
            thumb.setAttribute("aria-current", String(i === current));
        });

        thumbsElement.children[current]?.scrollIntoView({
            block: "nearest",
            inline: "center"
        });

        // Já baixa a próxima, para a troca ser instantânea
        new Image().src = items[(current + 1) % items.length].src;

    };

    const open = (templateId, start) => {

        const template = document.getElementById(templateId);

        if (!template) return;

        items = [...template.content.querySelectorAll("img")].map((img) => ({
            src: img.getAttribute("src"),
            thumb: img.dataset.thumb,
            width: img.getAttribute("width"),
            height: img.getAttribute("height"),
            title: img.dataset.title,
            alt: img.alt
        }));

        titleElement.textContent = template.dataset.title;

        thumbsElement.replaceChildren(...items.map((item, i) => {

            const button = document.createElement("button");
            button.type = "button";
            button.className = "gallery-thumb";
            button.setAttribute("aria-label", `Imagem ${i + 1}: ${item.title}`);
            button.addEventListener("click", () => show(i));

            const thumb = document.createElement("img");
            thumb.src = item.thumb;
            thumb.alt = "";

            button.append(thumb);

            return button;

        }));

        document.documentElement.classList.add("gallery-open");
        gallery.showModal();
        show(start);

    };

    document.querySelectorAll("[data-gallery]").forEach((trigger) => {
        trigger.addEventListener("click", () => {
            open(trigger.dataset.gallery, Number(trigger.dataset.galleryStart) || 0);
        });
    });

    gallery.querySelector("[data-gallery-prev]")
        .addEventListener("click", () => show(current - 1));

    gallery.querySelector("[data-gallery-next]")
        .addEventListener("click", () => show(current + 1));

    gallery.querySelector("[data-gallery-close]")
        .addEventListener("click", () => gallery.close());

    // Clique fora do conteúdo (no fundo escuro) fecha
    gallery.addEventListener("click", (event) => {
        if (event.target === gallery) gallery.close();
    });

    gallery.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") show(current - 1);
        if (event.key === "ArrowRight") show(current + 1);
    });

    gallery.addEventListener("close", () => {
        document.documentElement.classList.remove("gallery-open");
        imageElement.removeAttribute("src");
    });

    // Deslizar o dedo para os lados troca de imagem
    let touchStartX = null;

    imageElement.addEventListener("touchstart", (event) => {
        touchStartX = event.touches[0].clientX;
    }, { passive: true });

    imageElement.addEventListener("touchend", (event) => {

        if (touchStartX === null) return;

        const distance = event.changedTouches[0].clientX - touchStartX;

        if (Math.abs(distance) > 40) show(current + (distance < 0 ? 1 : -1));

        touchStartX = null;

    });

}


/* =========================
   CONTATO
   O mailto só funciona se a pessoa tiver um app de
   e-mail configurado; no Chrome do Windows sem ele,
   o clique não faz nada. No computador, o botão abre
   a tela de escrever do Gmail; no celular, o mailto
   abre o app de e-mail normalmente.
========================= */

const contactButton = document.getElementById("contact-button");

if (contactButton && !isTouch) {
    contactButton.href = contactButton.dataset.gmail;
    contactButton.target = "_blank";
    contactButton.rel = "noopener";
}


document.querySelectorAll("[data-copy]").forEach((button) => {

    const label = button.querySelector("span");
    let timer = null;

    button.addEventListener("click", async () => {

        try {

            await navigator.clipboard.writeText(button.dataset.copy);
            label.textContent = "Copiado!";

        } catch {

            // Sem acesso à área de transferência: deixa o texto
            // selecionado para a pessoa copiar com Ctrl+C
            const range = document.createRange();
            range.selectNodeContents(button.previousElementSibling);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            label.textContent = "Selecionado";

        }

        clearTimeout(timer);
        timer = setTimeout(() => (label.textContent = "Copiar"), 2000);

    });

});
