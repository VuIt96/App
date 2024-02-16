async function init(t, e, l = "450px", s = "550px", domain = "https://owllee.io") {
    try {
        const id = await t;
        let iconLogo = null;

        const apiUrl = `${domain}/api/chatbot/avatar/${id}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        iconLogo = `${domain}${data.uri_avatar}`;

        const img = document.createElement("img");
        img.src = iconLogo;
        img.style.cssText = "width: 58px; height: 58px; padding: 1px; background-color: #3075FF; border-radius: 50%;";

        const chatbotContainer = document.createElement("div");
        chatbotContainer.style.cssText = "position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background-color: " + e + "; border-radius: 50%; color: #fff; display: flex; justify-content: center; align-items: center; cursor: pointer; z-index: 99999; box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; transition: all 0.3s ease-in-out;";
        chatbotContainer.appendChild(img);
        chatbotContainer.setAttribute("tabindex", "-1");

        const iframe = document.createElement("iframe");
        iframe.style.cssText = "z-index: 999; position: fixed; bottom: 100px; right: 20px; width: " + l + "; height: " + s + "; border: 1px solid #ffffff00; display: none; border-radius: 10px; box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px; opacity: 0; transition: opacity 0.2s ease-in-out; user-select: none; max-height: 73vh; max-width: 90vw; -moz-user-select: none; -webkit-user-select: none; -khtml-user-select: none;";
        iframe.src = `${domain}/chatbot-iframe/${id}`;

        let isDragging = false;
        let offsetX, offsetY;

        chatbotContainer.addEventListener("mousedown", (event) => {
            isDragging = true;
            offsetX = event.clientX - chatbotContainer.getBoundingClientRect().left;
            offsetY = event.clientY - chatbotContainer.getBoundingClientRect().top;
        });

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        function handleMouseMove(event) {
            if (isDragging) {
                requestAnimationFrame(() => {
                    chatbotContainer.style.right = `${window.innerWidth - event.clientX - offsetX}px`;
                    chatbotContainer.style.bottom = `${window.innerHeight - event.clientY - offsetY}px`;
                });
            }
        }

        function handleMouseUp() {
            isDragging = false;
        }

        function resetPosition() {
            chatbotContainer.style.right = "20px";
            chatbotContainer.style.bottom = "20px";
        }

        chatbotContainer.addEventListener("click", () => {
            if (iframe.style.display === "block") {
                iframe.style.opacity = "0";
                iframe.addEventListener("transitionend", () => {
                    iframe.style.display = "none";
                }, { once: true });
                resetPosition();
            } else {
                resetPosition(); // Đặt lại vị trí khi click
                iframe.style.display = "block";
                setTimeout(() => {
                    iframe.style.opacity = "1";
                }, 0);
            }
        });

        document.body.appendChild(chatbotContainer);
        document.body.appendChild(iframe);
    } catch (error) {
        console.error(error);
    }
}

function ready(callback) {
    if (document.readyState !== "loading") {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}

(function () {
    const botId = document.querySelector('script[data-chat-service="Salebot"][data-bot-id]').getAttribute("data-bot-id");
    const bubbleColor = document.querySelector('script[data-chat-service="Salebot"][data-bubble-color]').getAttribute("data-bubble-color");
    const chatWidth = document.querySelector('script[data-chat-service="Salebot"][data-chat-width]').getAttribute("data-chat-width");
    const chatHeight = document.querySelector('script[data-chat-service="Salebot"][data-chat-height]').getAttribute("data-chat-height");
    const domain = document.querySelector('script[data-chat-service="Salebot"][data-chat-domain]').getAttribute("data-chat-domain");

    ready(() => init(botId, bubbleColor, chatWidth, chatHeight, domain));
})();
