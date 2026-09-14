const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const header = $("#header");
const progress = $("#progress");
const menu = $("#menu");
const nav = $("#nav");

addEventListener("scroll", () => {

    header.classList.toggle("scrolled", scrollY > 20);

    const max =
        document.documentElement.scrollHeight - innerHeight;

    progress.style.width =
        (max ? scrollY / max * 100 : 0) + "%";

    const top = $("#top");

    if (top) {
        top.classList.toggle("top-button", scrollY > 600);
    }

});


menu.addEventListener("click", () => {
    nav.classList.toggle("open");
});


$$("#nav a").forEach(a => {

    a.addEventListener("click", () => {
        nav.classList.remove("open");
    });

});


const io = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                io.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);


$$(".reveal").forEach(element => {
    io.observe(element);
});


let counted = false;

const counters = $$("[data-count]");

const counterObserver = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting && !counted) {

                counted = true;

                counters.forEach(element => {

                    let number = 0;

                    const target =
                        Number(element.dataset.count);

                    const timer = setInterval(() => {

                        number =
                            Math.min(target, number + 12);

                        element.textContent = number;

                        if (number >= target) {
                            clearInterval(timer);
                        }

                    }, 30);

                });

            }

        });

    }
);


counters.forEach(element => {
    counterObserver.observe(element);
});


const activeObserver = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                $$("#nav a").forEach(link => {

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
        rootMargin: "-35% 0 -55% 0"
    }
);


$$("main section[id]").forEach(section => {
    activeObserver.observe(section);
});


const topButton = $("#top");

if (topButton) {

    topButton.addEventListener("click", () => {

        scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


const year = $("#year");

if (year) {
    year.textContent = new Date().getFullYear();
}


/* FORMULAIRE */

$("#form").addEventListener("submit", async event => {

    event.preventDefault();

    const form = event.currentTarget;

    const note = $("#formNote");

    const button =
        form.querySelector('button[type="submit"]');

    const name =
        $("#name").value.trim();

    note.classList.remove("error");

    note.textContent =
        "Envoi de votre demande…";

    button.disabled = true;

    try {

        const response = await fetch(
            form.action,
            {
                method: "POST",

                headers: {
                    "Accept": "application/json"
                },

                body: new FormData(form)
            }
        );

        if (!response.ok) {
            throw new Error("send");
        }

        note.textContent =
            "Merci " + name +
            ". Votre demande a bien été envoyée.";

        form.reset();

    } catch (error) {

        note.classList.add("error");

        note.textContent =
            "L’envoi a échoué. Vérifiez votre connexion puis réessayez.";

    } finally {

        button.disabled = false;

    }

});


/* CURSEUR PC */

if (matchMedia("(pointer:fine)").matches) {

    const cursor = $("#cursor");

    document.addEventListener("mousemove", event => {

        cursor.style.left =
            event.clientX + "px";

        cursor.style.top =
            event.clientY + "px";

    });

}
