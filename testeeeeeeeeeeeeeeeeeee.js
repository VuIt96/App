async function init(t, l = "450px", s = "550px", domain = "https://owllee.io") {
    let id = await t;
    let iconLogo = null;
    let v = true;
    let a = false;
    let bubbleButtonAlign = 'right';
    let bubbleButtonColor = '#3075FF';
    const apiUrl = `${domain}/api/chatbot/avatar/${id}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`error: ${response.status}`);
    }

    const data = await response.json();
    bubbleButtonAlign = data.bubble_button_align;
    bubbleButtonColor = data.bubble_button_color;

    iconLogo = `${domain}${data.uri_avatar}`;
    const img = document.createElement("img");
    img.src = `${iconLogo}`;
    img.style.width = img.style.height = "60px";
    img.style.padding = "1px";
    img.style.backgroundColor = bubbleButtonColor;
    img.style.borderRadius = "50%";

    let iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.zIndex = "999";
    iframe.style.width = l;
    iframe.style.height = s;
    iframe.style.bottom = "100px";
    iframe.style[bubbleButtonAlign] = "20px";
    iframe.style.border = "1px solid #ffffff00";
    iframe.style.borderRadius = "10px";
    iframe.style.boxShadow = "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px";
    iframe.style.opacity = "0";
    iframe.style.transition = "opacity 0.2s ease-in-out";
    iframe.style.userSelect = "none";
    iframe.style.maxHeight = "73vh";
    iframe.style.maxWidth = "90vw";
    iframe.src = `${domain}/chatbot-iframe/${id}`;

    if (v) {
        iframe.style.display = "block";
        iframe.style.opacity = "1";
        a = true;
        r.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M18 6l-12 12"></path> <path d="M6 6l12 12"></path> </svg>';
    }

    let buttonDiv = document.createElement("div");
    buttonDiv.style.position = "fixed";
    buttonDiv.style.bottom = "20px";
    buttonDiv.style[bubbleButtonAlign] = "20px";
    buttonDiv.style.width = buttonDiv.style.height = "60px";
    buttonDiv.style.backgroundColor = bubbleButtonColor;
    buttonDiv.style.borderRadius = "50%";
    buttonDiv.style.color = "#fff";
    buttonDiv.style.display = "flex";
    buttonDiv.style.justifyContent = "center";
    buttonDiv.style.alignItems = "center";
    buttonDiv.style.cursor = "pointer";
    buttonDiv.style.zIndex = "99999";
    buttonDiv.style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px";
    buttonDiv.appendChild(img);
    buttonDiv.setAttribute("tabindex", "-1");

    buttonDiv.addEventListener("click", () => {
        if (a) {
            iframe.style.opacity = "0";
            setTimeout(() => {
                iframe.style.display = "none";
            }, 200);
            a = false;
            buttonDiv.appendChild(img);
        } else {
            iframe.style.display = "block";
            setTimeout(() => {
                iframe.style.opacity = "1";
            }, 0);
            a = true;
            buttonDiv.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M18 6l-12 12"></path> <path d="M6 6l12 12"></path> </svg>';
        }
    });

    document.body.appendChild(buttonDiv);
    document.body.appendChild(iframe);
}

function ready(t) {
    if ("loading" !== document.readyState) {
        t();
        return;
    }
    document.addEventListener("DOMContentLoaded", t);
}

!(function () {
    let t = document.querySelector('script[data-chat-service="Salebot"][data-bot-id]').getAttribute("data-bot-id");
    let l = document.querySelector('script[data-chat-service="Salebot"][data-chat-width]').getAttribute("data-chat-width");
    let s = document.querySelector('script[data-chat-service="Salebot"][data-chat-height]').getAttribute("data-chat-height");
    let domain = document.querySelector('script[data-chat-service="Salebot"][data-chat-domain]').getAttribute("data-chat-domain");
    ready(() => init(t, l, s, domain));
})();
