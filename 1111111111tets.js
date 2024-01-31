async function init(t, e, l = "450px", s = "550px", domain = "https://owllee.io") {
    try {
        let id = await t;
        let iconLogo = null;

        // Lấy đường dẫn ảnh avatar từ API
        const apiUrl = `${domain}/api/chatbot/avatar/${id}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        iconLogo = `${domain}${data.uri_avatar}`;

        // Tạo thẻ <img> cho avatar
        const img = document.createElement("img");
        img.src = `${iconLogo}`;
        img.style.width = "58px";
        img.style.height = "58px";
        img.style.padding = "1px";
        img.style.backgroundColor = "#3075FF";
        img.style.borderRadius = "50%";

        // Tạo thẻ <div> cho bong bóng chat
        let i = `${domain}/chatbot-iframe/${id}`,
            r = document.createElement("div");
        r.style.position = "fixed";
        r.style.bottom = "20px";
        r.style.right = "20px";
        r.style.width = "60px";
        r.style.height = "60px";
        r.style.backgroundColor = e;
        r.style.borderRadius = "50%";
        r.style.color = "#fff";
        r.style.display = "flex";
        r.style.justifyContent = "center";
        r.style.alignItems = "center";
        r.style.cursor = "pointer";
        r.style.zIndex = "99999";
        r.style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px";
        r.style.transition = "all 0.3s ease-in-out";
        r.appendChild(img);
        r.setAttribute("tabindex", "-1");

        // Tạo thẻ <iframe> cho nội dung chatbot
        let $ = document.createElement("iframe");
        $.style.zIndex = "999";
        $.style.position = "fixed";
        $.style.bottom = "100px";
        $.style.right = "20px";
        $.style.width = l;
        $.style.height = s;
        $.style.border = "1px solid #ffffff00";
        $.style.display = "none";
        $.style.borderRadius = "10px";
        $.style.boxShadow = "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px";
        $.style.opacity = "0";
        $.style.transition = "opacity 0.2s ease-in-out";
        $.style.userSelect = "none";
        $.style.maxHeight = "73vh";
        $.style.maxWidth = "90vw";
        $.style.setProperty("-moz-user-select", "none");
        $.style.setProperty("-webkit-user-select", "none");
        $.style.setProperty("-khtml-user-select", "none");
        $.src = i;

        // Khai báo biến để kiểm tra trạng thái mở/đóng của chatbot và di chuyển
        let isOpen = false;
        let isDragging = false;
        let offsetX, offsetY;

        // Sự kiện mousedown để bắt đầu kéo di chuyển
        r.addEventListener("mousedown", (event) => {
            isDragging = true;
            offsetX = event.clientX - r.getBoundingClientRect().left;
            offsetY = event.clientY - r.getBoundingClientRect().top;
        });

        // Sự kiện mousemove để di chuyển bong bóng chat
        document.addEventListener("mousemove", (event) => {
            if (isDragging) {
                const x = event.clientX - offsetX;
                const y = event.clientY - offsetY;
                r.style.transform = `translate(${x}px, ${y}px)`;
            }
        });

        // Sự kiện mouseup để kết thúc kéo di chuyển
        document.addEventListener("mouseup", () => {
            isDragging = false;
        });

        // Sự kiện click để mở/đóng chatbot
        r.addEventListener("click", () => {
            if (isOpen) {
                $.style.opacity = "0";
                setTimeout(() => {
                    $.style.display = "none";
                }, 200);
                isOpen = false;
                r.appendChild(img);
            } else {
                $.style.display = "block";
                setTimeout(() => {
                    $.style.opacity = "1";
                }, 0);
                isOpen = true;
                r.innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M18 6l-12 12"></path> <path d="M6 6l12 12"></path> </svg>';
            }
        });

        // Thêm thẻ <div> và <iframe> vào body
        document.body.appendChild(r);
        document.body.appendChild($);
    } catch (error) {
        console.error(error);
    }
}

function ready(t) {
    if ("loading" !== document.readyState) {
        t();
        return;
    }
    document.addEventListener("DOMContentLoaded", t);
}

// Kích thước và màu sắc của bong bóng chat có thể được đặt từ các thuộc tính data-chat-width, data-chat-height và data-bubble-color trong thẻ script
!(function () {
    let t = document
        .querySelector('script[data-chat-service="Salebot"][data-bot-id]')
        .getAttribute("data-bot-id"),
        e =
            document
                .querySelector('script[data-chat-service="Salebot"][data-bubble-color]')
                .getAttribute("data-bubble-color"),
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
    ready(() => init(t, e, l, s, domain));
})();
