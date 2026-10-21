
(() => {
    "use strict";

    const data = window.BLOG_DATA || {};

    const groups = Array.isArray(data.widgets)
        ? data.widgets
        : [];

    const $ = (s, p = document) => p.querySelector(s);

    const norm = (v) =>
        String(v ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

    const urlOf = (v) => {
        try {
            const u = new URL(
                String(v || "").trim(),
                location.href
            );

            return /^https?:$/i.test(u.protocol)
                ? u.href
                : null;

        } catch {
            return null;
        }
    };

    const host = (v) => {
        try {
            return new URL(v)
                .hostname
                .replace(/^www\./i, "");

        } catch {
            return "link externo";
        }
    };

    const esc = (v) =>
        String(v ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    const valid = groups
        .filter((g) => g && typeof g === "object")
        .map((g) => ({
            title: String(g.title || "Sem título"),

            group: String(g.group || "Outros"),

            items: (
                Array.isArray(g.items)
                    ? g.items
                    : []
            )
                .filter((i) => i && i.name)
                .map((i) => ({
                    name: String(i.name),
                    url: urlOf(i.url)
                }))
                .filter((i) => i.url)
        }))
        .filter((g) => g.items.length);

    let current = "all";

    const filters = $("#filters");
    const catalog = $("#catalog");
    const count = $("#resultsCount");
    const search = $("#search");
    const sort = $("#sort");


    // ========================================
    // FILTROS
    // ========================================

    function renderFilters() {

        if (!filters) {
            return;
        }

        const cats = [
            ["all", "Tudo"],

            ...Array.from(
                new Set(
                    valid.map((g) => g.group)
                )
            ).map((v) => [v, v])
        ];

        filters.innerHTML = cats
            .map(([v, l]) => `
                <button
                    class="filter ${v === current ? "active" : ""}"
                    type="button"
                    data-filter="${esc(v)}"
                    aria-pressed="${v === current}"
                >
                    ${esc(l)}
                </button>
            `)
            .join("");

        filters
            .querySelectorAll(".filter")
            .forEach((b) => {

                b.onclick = () => {

                    current =
                        b.dataset.filter || "all";

                    renderFilters();
                    renderCatalog();
                };

            });
    }


    // ========================================
    // FILTRAGEM
    // ========================================

    function filtered() {

        const q = norm(
            search?.value
        );

        let list = valid

            .filter((g) =>
                current === "all" ||
                g.group === current
            )

            .map((g) => ({
                ...g,

                items: g.items.filter((i) =>
                    !q ||
                    norm(i.name).includes(q) ||
                    norm(g.title).includes(q) ||
                    norm(g.group).includes(q)
                )
            }))

            .filter((g) =>
                g.items.length
            );


        if (sort?.value === "az") {

            list.sort((a, b) =>
                a.title.localeCompare(
                    b.title,
                    "pt-BR",
                    {
                        sensitivity: "base"
                    }
                )
            );
        }

        return list;
    }


    // ========================================
    // CATÁLOGO
    // ========================================

    function renderCatalog() {

        if (!catalog) {
            return;
        }

        const q = norm(
            search?.value
        );

        const list = filtered();

        let total = 0;

        catalog.innerHTML = "";


        list.forEach((g) => {

            total += g.items.length;


            const d =
                document.createElement("details");

            d.className =
                "catalog-section";

            d.open = !!q;


            const s =
                document.createElement("summary");

            s.innerHTML = `
                <span>
                    ${esc(g.title)}
                </span>

                <span>
                    ${g.items.length}
                </span>
            `;


            const grid =
                document.createElement("div");

            grid.className =
                "link-grid";


            const items = [...g.items].sort(
                (a, b) =>

                    sort?.value === "az"

                        ? a.name.localeCompare(
                            b.name,
                            "pt-BR",
                            {
                                sensitivity: "base"
                            }
                        )

                        : 0
            );


            items.forEach((i) => {

                const a =
                    document.createElement("a");

                a.className =
                    "link-item";

                a.href = i.url;

                a.target = "_blank";

                a.rel =
                    "noopener noreferrer";


                a.innerHTML = `
                    ${esc(i.name)}

                    <small>
                        ${esc(host(i.url))}
                    </small>
                `;


                grid.appendChild(a);
            });


            d.append(
                s,
                grid
            );

            catalog.appendChild(d);

        });


        if (count) {

            count.textContent =
                `${total.toLocaleString("pt-BR")} ${
                    total === 1
                        ? "item"
                        : "itens"
                } encontrados`;
        }


        if (!list.length) {

            catalog.innerHTML = `
                <div class="catalog-section">

                    <div class="empty-state">
                        Nenhum item encontrado
                        para essa busca.
                    </div>

                </div>
            `;
        }
    }


    // ========================================
    // JOGOS
    // ========================================

    function renderGames() {

        const target =
            $("#gameCards");

        if (!target) {
            return;
        }


        const gs = valid

            .filter((g) =>
                /jogos|expert|gênios|de onde vem/i
                    .test(g.title)
            )

            .slice(0, 6);


        const icons = [
            "🎮",
            "🧠",
            "🧪",
            "🔤",
            "🌎",
            "🎥"
        ];


        target.innerHTML = gs

            .map((g, i) => `

                <a
                    class="game-card"
                    href="#materiais"
                    data-game="${esc(g.title)}"
                >

                    <div class="icon">
                        ${icons[i % icons.length]}
                    </div>

                    <h3>
                        ${esc(g.title)}
                    </h3>

                    <p>
                        ${g.items.length.toLocaleString("pt-BR")}
                        atividades e links.
                    </p>

                </a>

            `)

            .join("");


        target
            .querySelectorAll("[data-game]")
            .forEach((a) => {

                a.onclick = () => {

                    const g =
                        valid.find(
                            (x) =>
                                x.title ===
                                a.dataset.game
                        );


                    if (g) {

                        current =
                            g.group;

                        renderFilters();
                        renderCatalog();
                    }

                };

            });
    }


    // ========================================
    // ALUNOS
    // ========================================

    function renderStudents() {

        const target =
            $("#studentGrid");

        if (!target) {
            return;
        }


        const ss = valid.filter(
            (g) =>
                norm(g.group) ===
                "alunos 2020"
        );


        target.innerHTML = ss

            .map((g) => `

                <a
                    class="student-card"
                    href="#materiais"
                    data-student="${esc(g.title)}"
                >

                    <strong>
                        ${esc(g.title)}
                    </strong>

                    <span>
                        ${g.items.length.toLocaleString("pt-BR")}
                        atividades
                    </span>

                </a>

            `)

            .join("");


        target
            .querySelectorAll("[data-student]")
            .forEach((a) => {

                a.onclick = () => {

                    const g =
                        valid.find(
                            (x) =>
                                x.title ===
                                a.dataset.student
                        );


                    if (g) {

                        current =
                            g.group;

                        renderFilters();
                        renderCatalog();
                    }

                };

            });
    }


    // ========================================
    // POSTAGEM ORIGINAL
    // ========================================

    function renderPost() {

        const target =
            $("#postContent");

        if (!target || !data.post) {
            return;
        }


        const doc =
            new DOMParser()
                .parseFromString(
                    String(
                        data.post.html || ""
                    ),
                    "text/html"
                );


        doc
            .querySelectorAll(
                ".post-footer, " +
                ".comments, " +
                "#comments, " +
                ".post-icons, " +
                ".post-share-buttons, " +
                ".item-control"
            )

            .forEach((n) =>
                n.remove()
            );


        target.innerHTML =
            doc.body.innerHTML.trim() ||

            "<p>O conteúdo original não pôde ser exibido.</p>";
    }


    // ========================================
    // PERFIL
    // ========================================

    function renderProfile() {

        const link =
            $("#profileLink");

        const portrait =
            $("#portrait");

        const profile =
            data.profile || {};


        const u =
            urlOf(profile.url);


        if (link && u) {

            link.href = u;

        } else if (link) {

            link.hidden = true;
        }


        const imgUrl =
            urlOf(profile.image);


        if (
            portrait &&
            imgUrl
        ) {

            const img =
                document.createElement("img");


            img.src =
                imgUrl;


            img.alt =
                `Foto de ${
                    profile.name ||
                    "Ana Cláudia Mesquita"
                }`;


            img.loading =
                "lazy";


            img.onerror = () =>
                img.remove();


            portrait.textContent =
                "";


            portrait.appendChild(
                img
            );
        }
    }


    // ========================================
    // MENU MOBILE
    // ========================================

    function setupMenu() {

        const btn =
            $("#menuBtn");

        const nav =
            document.querySelector(
                ".main-nav"
            );


        if (!btn || !nav) {
            return;
        }


        const close = () => {

            nav.classList.remove(
                "mobile-open"
            );

            document.body.classList.remove(
                "menu-open"
            );

            btn.setAttribute(
                "aria-expanded",
                "false"
            );

            btn.textContent =
                "☰";
        };


        btn.onclick = () => {

            const open =
                nav.classList.toggle(
                    "mobile-open"
                );


            document.body.classList.toggle(
                "menu-open",
                open
            );


            btn.setAttribute(
                "aria-expanded",
                String(open)
            );


            btn.textContent =
                open
                    ? "×"
                    : "☰";
        };


        nav
            .querySelectorAll("a")
            .forEach((a) => {

                a.onclick =
                    close;

            });
    }


    // ========================================
    // BUSCA
    // ========================================

    $("#search")?.addEventListener(
        "input",
        renderCatalog
    );


    $("#sort")?.addEventListener(
        "change",
        renderCatalog
    );


    $("#clearSearch")?.addEventListener(
        "click",
        () => {

            if (search) {

                search.value = "";

                search.focus();

                renderCatalog();
            }

        }
    );


    // ========================================
    // INICIALIZAÇÃO
    // ========================================

    renderProfile();

    renderPost();

    renderFilters();

    renderCatalog();

    renderGames();

    renderStudents();

    setupMenu();

})();
