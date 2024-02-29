async function init(t, e, l = "450px", s = "550px", domain="https://owllee.io", align = "right") {
    let id = await t;
    let iconLogo = null;

    const apiUrl = `${domain}/api/chatbot/avatar/${id}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error(`error: ${response.status}`);
    }
    const data = await response.json();
    iconLogo = `${domain}${data.uri_avatar}`;
    const img = document.createElement("img");
    img.src = `${iconLogo}`;
    img.style.width = "58px";
    img.style.height = "58px";
    img.style.padding = "1px";
    img.style.backgroundColor = e;
    img.style.borderRadius = "50%";

    let i = `${domain}/chatbot-iframe/${id}`,
        r = document.createElement("div");
    (r.style.position = "fixed"),
        (r.style.bottom = "20px"),
        (r.style[align] = "20px"),
        (r.style.width = "60px"),
        (r.style.height = "60px"),
        (r.style.backgroundColor = e),
        (r.style.borderRadius = "50%"),
        (r.style.color = "#fff"),
        (r.style.display = "flex"),
        (r.style.justifyContent = "center"),
        (r.style.alignItems = "center"),
        (r.style.cursor = "pointer"),
        (r.style.zIndex = "99999"),
        (r.style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px"),
        (r.appendChild(img)),
        r.setAttribute("tabindex", "-1");

    let $ = document.createElement("iframe");
    ($.style.zIndex = "999"),
        ($.style.position = "fixed"),
        ($.style.bottom = "100px"),
        ($.style[align] = "20px"),
        ($.style.width = l),
        ($.style.height = s),
        ($.style.border = "1px solid #ffffff00"),
        ($.style.display = "none"),
        ($.style.borderRadius = "10px"),
        ($.style.boxShadow =
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"),
        ($.style.opacity = "0"),
        ($.style.transition = "opacity 0.2s ease-in-out"),
        ($.style.userSelect = "none"),
        ($.style.maxHeight = "73vh"),
        ($.style.maxWidth = "90vw"),
        $.style.setProperty("-moz-user-select", "none"),
        $.style.setProperty("-webkit-user-select", "none"),
        $.style.setProperty("-khtml-user-select", "none"),
        ($.src = i);
    let a = !1;
    r.addEventListener("click", () => {
        a
            ? (($.style.opacity = "0"),
                setTimeout(() => {
                    $.style.display = "none";
                }, 200),
                (a = !1),
                (r.appendChild(img)))
            : (($.style.display = "block"),
                setTimeout(() => {
                    $.style.opacity = "1";
                }, 0),
                (a = !0),
                (r.innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M18 6l-12 12"></path> <path d="M6 6l12 12"></path> </svg>'));
    }),
        document.body.appendChild(r),
        document.body.appendChild($);
}

function ready(t) {
    if ("loading" !== document.readyState) {
        t();
        return;
    }
    document.addEventListener("DOMContentLoaded", t);
}

!(function () {
    let t = document
            .querySelector('script[data-chat-service="Salebot"][data-bot-id]')
            .getAttribute("data-bot-id"),
        e =
            document
                .querySelector('script[data-chat-service="Salebot"][dbubble_button_color]')
                .getAttribute("dbubble_button_color"),
        l =
            document
                .querySelector('script[data-chat-service="Salebot"][data-chat-width]')
                .getAttribute("data-chat-width"),
        s =
            document
                .querySelector('script[data-chat-service="Salebot"][data-chat-height]')
                .getAttribute("data-chat-height"),
                domain = document.querySelector('script[data-chat-service="Salebot"][data-chat-domain]')
                .getAttribute("data-chat-domain");
      align = document.querySelector('script[data-chat-service="Salebot"][bubble-button-align]')
              .getAttribute("bubble-button-align");
    ready(() => init(t, e, l, s, domain, align));
})();
