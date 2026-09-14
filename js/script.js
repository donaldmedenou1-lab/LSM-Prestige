/*
========================================
LSM — LA SOLUTION MULTIMÉDIA
JavaScript principal
========================================
*/

/*
On indique au CSS que JavaScript est bien actif.
Ainsi les animations .reveal peuvent fonctionner.
Si JS ne fonctionne pas, le contenu reste quand même visible.
*/
document.documentElement.classList.add("js-ready");


/* =========================
SELECTEURS
========================= */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


/* =========================
ELEMENTS
========================= */

const header = $("#header");
const progress = $("#progress");
const menu = $("#menu");
const nav = $("#nav");
const topButton = $("#top");


/* =========================
SCROLL
========================= */

addEventListener("scroll", () => {

    /* Header */
    header.classList.toggle(
        "scrolled",
        scrollY > 20
    );


    /* Barre de progression */
    const max =
        document.documentElement.scrollHeight -
        innerHeight;

    progress.style.width =
        (max ? (scrollY / max) * 100 : 0) + "%";


    /* Bouton retour en haut */
    topButton.classList.toggle(
        "show",
        scrollY > 600
    );

});


/* =========================
MENU MOBILE
========================= */

if (menu) {

    menu.addEventListener("click", () => {

        nav.classList.toggle("open");

    });

}


/* Fermer le menu après avoir cliqué */

$$("#nav a").forEach((link) => {

    link.addEventListener("click", () => {

        nav.classList.remove("open");

    });

});


/* =========================
ANIMATIONS REVEAL
========================= */

const revealObserver =
    new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.12
        }

    );


$$(".reveal").forEach((element) => {

    revealObserver.observe(element);

});


/* =========================
COMPTEUR 360
========================= */

let counted = false;

const counters = $$("[data-count]");

const counterObserver =
    new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (
                    entry.isIntersecting &&
                    !counted
                ) {

                    counted = true;

                    counters.forEach((element) => {

                        let number = 0;

                        const target =
                            Number(
                                element.dataset.count
                            );

                        const timer =
                            setInterval(() => {

                                number =
                                    Math.min(
                                        target,
                                        number + 12
                                    );

                                element.textContent =
                                    number;

                                if (
                                    number >= target
                                ) {

                                    clearInterval(timer);

                                }

                            }, 30);

                    });

                }

            });

        }

    );


counters.forEach((element) => {

    counterObserver.observe(element);

});


/* =========================
NAVIGATION ACTIVE
========================= */

const activeObserver =
    new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    $$("#nav a").forEach((link) => {

                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") ===
                            "#" + entry.target.id
                        );

                    });

                }

            });

        },

        {
            rootMargin:
                "-35% 0 -55% 0"
        }

    );


$$("main section[id]").forEach((section) => {

    activeObserver.observe(section);

});


/* =========================
RETOUR EN HAUT
========================= */

if (topButton) {

    topButton.addEventListener(
        "click",
        () => {

            scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =========================
ANNEE FOOTER
========================= */

const year = $("#year");

if (year) {

    year.textContent =
        new Date().getFullYear();

}


/* =========================
FORMULAIRE LSM
========================= */

const form = $("#form");

if (form) {

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const note =
                $("#formNote");

            const button =
                form.querySelector(
                    'button[type="submit"]'
                );

            const name =
                $("#name").value.trim();


            note.textContent =
                "Envoi de votre demande…";

            button.disabled = true;


            try {

                /*
                FormSubmit accepte l'envoi AJAX
                sans quitter la page.
                */

                const response =
                    await fetch(
                        form.action,
                        {
                            method: "POST",

                            headers: {
                                Accept:
                                    "application/json"
                            },

                            body:
                                new FormData(form)
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "send"
                    );

                }


                note.textContent =
                    "Merci " +
                    name +
                    ". Votre demande a bien été envoyée.";


                form.reset();


            } catch (error) {

                note.textContent =
                    "L’envoi a échoué. Vérifiez votre connexion puis réessayez.";

            } finally {

                button.disabled = false;

            }

        }
    );

}


/* =========================
CURSEUR PC
========================= */

if (
    matchMedia(
        "(pointer:fine)"
    ).matches
) {

    const cursor = $("#cursor");

    if (cursor) {

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

}
