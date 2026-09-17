/* =========================================================
   LSM — LA SOLUTION MULTIMÉDIA
   JavaScript principal
   ========================================================= */

document.documentElement.classList.add("js-ready");

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


/* =========================================================
   HEADER + BARRE DE PROGRESSION
   ========================================================= */

const header = $("#header");
const progress = $("#progress");

function updateScroll() {

    if (header) {
        header.classList.toggle("scrolled", window.scrollY > 20);
    }


    if (progress) {

        const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;

        const percentage =
            maxScroll > 0
                ? (window.scrollY / maxScroll) * 100
                : 0;

        progress.style.width = percentage + "%";
    }

}

window.addEventListener(
    "scroll",
    updateScroll,
    { passive: true }
);

updateScroll();


/* =========================================================
   MENU MOBILE
   ========================================================= */

const menu = $("#menu");
const nav = $("#nav");

if (menu && nav) {

    menu.addEventListener("click", () => {

        nav.classList.toggle("open");

        menu.setAttribute(
            "aria-expanded",
            nav.classList.contains("open")
        );

    });


    $$("#nav a").forEach((link) => {

        link.addEventListener("click", () => {

            nav.classList.remove("open");

            menu.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}


/* =========================================================
   ANIMATIONS AU SCROLL
   ========================================================= */

const revealElements = $$(".reveal");

if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach((element) => {

        revealObserver.observe(element);

    });

} else {

    revealElements.forEach((element) => {

        element.classList.add("visible");

    });

}


/* =========================================================
   COMPTEURS DES STATISTIQUES
   ========================================================= */

const counters = $$("[data-count]");
let countersStarted = false;

if (
    counters.length &&
    "IntersectionObserver" in window
) {

    const counterObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (
                        entry.isIntersecting &&
                        !countersStarted
                    ) {

                        countersStarted = true;


                        counters.forEach((element) => {

                            const target =
                                parseInt(
                                    element.dataset.count,
                                    10
                                ) || 0;


                            let current = 0;

                            const duration = 900;
                            const stepTime = 30;

                            const steps =
                                Math.max(
                                    1,
                                    Math.ceil(
                                        duration /
                                        stepTime
                                    )
                                );


                            const increment =
                                target / steps;


                            const timer =
                                setInterval(() => {

                                    current += increment;


                                    if (
                                        current >=
                                        target
                                    ) {

                                        current =
                                            target;

                                        clearInterval(
                                            timer
                                        );

                                    }


                                    element.textContent =
                                        Math.floor(
                                            current
                                        );

                                }, stepTime);

                        });


                        observer.disconnect();

                    }

                });

            },
            {
                threshold: 0.3
            }
        );


    counters.forEach((element) => {

        counterObserver.observe(element);

    });

}


/* =========================================================
   NAVIGATION ACTIVE
   ========================================================= */

const sections = $$(
    "main section[id]"
);

const navLinks = $$(
    "#nav a"
);


if (
    sections.length &&
    navLinks.length &&
    "IntersectionObserver" in window
) {

    const activeObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        navLinks.forEach((link) => {

                            const href =
                                link.getAttribute(
                                    "href"
                                );


                            link.classList.toggle(
                                "active",
                                href ===
                                "#" +
                                entry.target.id
                            );

                        });

                    }

                });

            },
            {
                rootMargin:
                    "-35% 0px -55% 0px"
            }
        );


    sections.forEach((section) => {

        activeObserver.observe(section);

    });

}


/* =========================================================
   BOUTON RETOUR EN HAUT
   ========================================================= */

const topButton = $("#top");

if (topButton) {

    /* Afficher / cacher le bouton */

    const updateTopButton = () => {

        if (window.scrollY > 500) {

            topButton.classList.add("show");

        } else {

            topButton.classList.remove("show");

        }

    };


    window.addEventListener(
        "scroll",
        updateTopButton,
        { passive: true }
    );


    updateTopButton();


    /* Retour en haut */

    topButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();


            window.scrollTo({

                top: 0,
                left: 0,
                behavior: "smooth"

            });

        }
    );

}


/* =========================================================
   LIENS ANCRES — SCROLL FLUIDE
   ========================================================= */

$$('a[href^="#"]').forEach((link) => {

    link.addEventListener(
        "click",
        (event) => {

            const targetId =
                link.getAttribute(
                    "href"
                );


            if (
                !targetId ||
                targetId === "#" ||
                targetId === "#top"
            ) {

                return;

            }


            const target =
                document.querySelector(
                    targetId
                );


            if (!target) {

                return;

            }


            event.preventDefault();


            target.scrollIntoView({

                behavior: "smooth",
                block: "start"

            });

        }
    );

});


/* =========================================================
   ANNÉE AUTOMATIQUE DANS LE FOOTER
   ========================================================= */

const year = $("#year");

if (year) {

    year.textContent =
        new Date().getFullYear();

}


/* =========================================================
   FORMULAIRE DE CONTACT
   =========================================================

   Le formulaire est maintenant envoyé directement
   à FormSubmit avec la méthode POST.

   Aucun JavaScript n'intercepte l'envoi.
   ========================================================= */


/* =========================================================
   CURSEUR PERSONNALISÉ — PC UNIQUEMENT
   ========================================================= */

const cursor = $("#cursor");

if (
    cursor &&
    window.matchMedia("(pointer:fine)").matches
) {

    document.addEventListener(
        "mousemove",
        (event) => {

            cursor.style.left =
                event.clientX + "px";

            cursor.style.top =
                event.clientY + "px";

        }
    );

}


/* =========================================================
   PROTECTION CONTRE LE DÉBORDEMENT HORIZONTAL
   ========================================================= */

/*
   Si un élément dépasse accidentellement la largeur
   de l'écran, le site ne doit plus créer de déplacement
   horizontal vers la droite.
*/

document.documentElement.style.overflowX =
    "hidden";

document.body.style.overflowX =
    "hidden";
