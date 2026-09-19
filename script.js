/* =========================
   EFEITO DE DIGITAÇÃO
========================= */

const typingElement =
    document.getElementById("typing");

const phrases = [
    "Desenvolvedor de Software",
    "Profissional de TI",
    "Entusiasta de Tecnologia"
];

let phraseIndex = 0;
let characterIndex = 0;
let deleting = false;


function typeEffect() {

    const currentPhrase =
        phrases[phraseIndex];

    if (!deleting) {

        typingElement.textContent =
            currentPhrase.substring(
                0,
                characterIndex + 1
            );

        characterIndex++;

        if (
            characterIndex ===
            currentPhrase.length
        ) {

            deleting = true;

            setTimeout(
                typeEffect,
                1800
            );

            return;

        }

    } else {

        typingElement.textContent =
            currentPhrase.substring(
                0,
                characterIndex - 1
            );

        characterIndex--;

        if (characterIndex === 0) {

            deleting = false;

            phraseIndex =
                (phraseIndex + 1)
                % phrases.length;

        }

    }

    const speed =
        deleting ? 45 : 80;

    setTimeout(
        typeEffect,
        speed
    );

}


typeEffect();



/* =========================
   PARTÍCULAS
========================= */

const particleContainer =
    document.getElementById(
        "particles"
    );


for (let i = 0; i < 45; i++) {

    const particle =
        document.createElement("div");

    particle.classList.add(
        "particle"
    );

    particle.style.left =
        Math.random() * 100 + "%";

    particle.style.top =
        Math.random() * 100 + "%";

    particle.style.animationDelay =
        Math.random() * 8 + "s";

    particle.style.animationDuration =
        5 + Math.random() * 8 + "s";

    particleContainer.appendChild(
        particle
    );

}



/* =========================
   SCROLL REVEAL
========================= */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(
                (entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "active"
                        );

                    }

                }
            );

        },
        {
            threshold: 0.15
        }
    );


revealElements.forEach(
    (element) => {

        revealObserver.observe(
            element
        );

    }
);



/* =========================
   EFEITO 3D NO CARD
========================= */

const codeWindow =
    document.querySelector(
        ".code-window"
    );


if (codeWindow) {

    codeWindow.addEventListener(
        "mousemove",
        (event) => {

            const rect =
                codeWindow.getBoundingClientRect();

            const x =
                event.clientX -
                rect.left;

            const y =
                event.clientY -
                rect.top;

            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;

            const rotateX =
                (y - centerY) / 20;

            const rotateY =
                (centerX - x) / 20;

            codeWindow.style.transform =
                `rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)`;

        }
    );


    codeWindow.addEventListener(
        "mouseleave",
        () => {

            codeWindow.style.transform =
                "rotateX(0) rotateY(0)";

        }
    );

}



/* =========================
   EFEITO NOS CARDS
========================= */

const cards =
    document.querySelectorAll(
        ".skill-card, .project-card"
    );


cards.forEach(
    (card) => {

        card.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    card.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;

                const percentX =
                    x / rect.width;

                const percentY =
                    y / rect.height;

                const moveX =
                    (percentX - 0.5) * 5;

                const moveY =
                    (percentY - 0.5) * 5;

                card.style.transform =
                    `translateY(-8px)
                     rotateX(${-moveY}deg)
                     rotateY(${moveX}deg)`;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "translateY(0) rotateX(0) rotateY(0)";

            }
        );

    }
);