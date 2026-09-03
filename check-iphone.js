(function () {
  "use strict";

  var iframe = null;
  var bubble = null;
  var avatarImg = null;

  var isOpen = false;
  var isExpanded = false;

  var chatDomain = "";
  var chatLang = "vi";
  var enableFullscreen = false;

  var bubbleButtonAlign = "right";
  var bubbleButtonColor = "#3075FF";

  var originalWidth = "450px";
  var originalHeight = "550px";

  var EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
  var DURATION = 380;
  var MARGIN = 20;
  var BOTTOM_GAP = 100;
  var Z_INDEX = "2147483647";

  // =========================================================
  // READY
  // =========================================================
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }

    document.addEventListener("DOMContentLoaded", callback);
  }

  function closeIcon() {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" ' +
      'width="24" height="24" viewBox="0 0 24 24" ' +
      'fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M18 6L6 18"></path>' +
      '<path d="M6 6L18 18"></path>' +
      "</svg>"
    );
  }

  function chatIcon() {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" ' +
      'width="28" height="28" viewBox="0 0 24 24" ' +
      'fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>' +
      "</svg>"
    );
  }

  // =========================================================
  // VIEWPORT - hỗ trợ Safari iPhone
  // =========================================================
  function getViewport() {
    var vv = window.visualViewport;

    if (vv) {
      return {
        width: vv.width || window.innerWidth,
        height: vv.height || window.innerHeight,
        offsetLeft: vv.offsetLeft || 0,
        offsetTop: vv.offsetTop || 0,
      };
    }

    return {
      width: window.innerWidth,
      height: window.innerHeight,
      offsetLeft: 0,
      offsetTop: 0,
    };
  }

  // =========================================================
  // GEOMETRY
  // =========================================================
  function toPx(value, viewport) {
    if (typeof value === "number") {
      return value;
    }

    var v = String(value).trim();

    if (v.indexOf("vw") !== -1) {
      return (parseFloat(v) / 100) * getViewport().width;
    }

    if (v.indexOf("vh") !== -1) {
      return (parseFloat(v) / 100) * getViewport().height;
    }

    if (v.indexOf("%") !== -1) {
      return (parseFloat(v) / 100) * viewport;
    }

    return parseFloat(v) || 0;
  }

  function normalRect() {
    var vp = getViewport();
    var vw = vp.width;
    var vh = vp.height;

    var w = Math.min(
      toPx(originalWidth, vw),
      Math.max(280, vw - MARGIN * 2)
    );

    var maxHeight = Math.max(300, vh - BOTTOM_GAP - MARGIN);

    var h = Math.min(
      toPx(originalHeight, vh),
      maxHeight
    );

    var left;

    if (bubbleButtonAlign === "left") {
      left = MARGIN + vp.offsetLeft;
    } else {
      left = Math.max(
        MARGIN + vp.offsetLeft,
        vp.offsetLeft + vw - MARGIN - w
      );
    }

    var top = Math.max(
      MARGIN + vp.offsetTop,
      vp.offsetTop + vh - BOTTOM_GAP - h
    );

    return {
      left: left,
      top: top,
      width: w,
      height: h,
      radius: 10,
    };
  }

  function fullRect() {
    var vp = getViewport();

    return {
      left: vp.offsetLeft,
      top: vp.offsetTop,
      width: vp.width,
      height: vp.height,
      radius: 0,
    };
  }

  function applyRect(rect, animate) {
    if (!iframe) {
      return;
    }

    if (animate) {
      iframe.style.transition = [
        "width " + DURATION + "ms " + EASE,
        "height " + DURATION + "ms " + EASE,
        "top " + DURATION + "ms " + EASE,
        "left " + DURATION + "ms " + EASE,
        "border-radius " + DURATION + "ms " + EASE,
        "opacity 200ms ease",
        "transform 200ms ease",
      ].join(", ");
    } else {
      iframe.style.transition =
        "opacity 200ms ease, transform 200ms ease";
    }

    iframe.style.left = rect.left + "px";
    iframe.style.top = rect.top + "px";
    iframe.style.right = "auto";
    iframe.style.bottom = "auto";
    iframe.style.width = rect.width + "px";
    iframe.style.height = rect.height + "px";
    iframe.style.borderRadius = rect.radius + "px";
  }

  function nextFrame(callback) {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(callback);
    });
  }

  // =========================================================
  // BUBBLE
  // =========================================================
  function createBubble() {
    var oldBubble = document.getElementById(
      "owlla-chatbot-bubble"
    );

    if (oldBubble) {
      bubble = oldBubble;
      return;
    }

    bubble = document.createElement("div");
    bubble.id = "owlla-chatbot-bubble";

    Object.assign(bubble.style, {
      position: "fixed",
      bottom: "20px",
      width: "60px",
      height: "60px",
      backgroundColor: bubbleButtonColor,
      borderRadius: "50%",
      color: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      zIndex: Z_INDEX,
      boxShadow: "rgba(0,0,0,0.24) 0px 3px 8px",
      boxSizing: "border-box",
      transition:
        "opacity 220ms ease, transform 320ms " + EASE,
      transform: "translateZ(0) scale(1)",
      opacity: "1",
      visibility: "visible",
      pointerEvents: "auto",
      touchAction: "manipulation",
      WebkitTapHighlightColor: "transparent",
    });

    if (bubbleButtonAlign === "left") {
      bubble.style.left = "20px";
      bubble.style.right = "auto";
    } else {
      bubble.style.right = "20px";
      bubble.style.left = "auto";
    }

    bubble.setAttribute("tabindex", "0");
    bubble.setAttribute("role", "button");

    // Hiển thị ngay, không phụ thuộc API
    bubble.innerHTML = chatIcon();

    function handleBubbleClick() {
      if (isOpen) {
        closeChatbot();
      } else {
        openChatbot();
      }
    }

    bubble.addEventListener("click", handleBubbleClick);

    bubble.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleBubbleClick();
      }
    });

    document.body.appendChild(bubble);
  }

  function setBubbleContent(showClose) {
    if (!bubble) {
      return;
    }

    bubble.innerHTML = "";

    if (showClose) {
      bubble.innerHTML = closeIcon();
      return;
    }

    if (avatarImg) {
      bubble.appendChild(avatarImg.cloneNode(true));
      return;
    }

    bubble.innerHTML = chatIcon();
  }

  function updateBubblePosition() {
    if (!bubble) {
      return;
    }

    bubble.style.backgroundColor = bubbleButtonColor;

    if (bubbleButtonAlign === "left") {
      bubble.style.left = "20px";
      bubble.style.right = "auto";
    } else {
      bubble.style.right = "20px";
      bubble.style.left = "auto";
    }
  }

  function showBubble(show) {
    if (!bubble) {
      return;
    }

    bubble.style.opacity = show ? "1" : "0";

    bubble.style.transform = show
      ? "translateZ(0) scale(1)"
      : "translateZ(0) scale(0.6)";

    bubble.style.pointerEvents = show ? "auto" : "none";
    bubble.style.visibility = show ? "visible" : "hidden";
  }

  // =========================================================
  // IFRAME
  // =========================================================
  function createIframe(url) {
    var oldIframe = document.getElementById(
      "owlla-chatbot-iframe"
    );

    if (oldIframe) {
      iframe = oldIframe;
      iframe.src = url;
      return;
    }

    iframe = document.createElement("iframe");
    iframe.id = "owlla-chatbot-iframe";
    iframe.src = url;

    iframe.setAttribute("allow", "microphone; autoplay");
    iframe.setAttribute("allowfullscreen", "true");

    Object.assign(iframe.style, {
      position: "fixed",
      zIndex: Z_INDEX,
      border: "1px solid transparent",
      backgroundColor: "#fff",
      boxShadow:
        "rgba(60,64,67,0.3) 0px 1px 2px 0px, " +
        "rgba(60,64,67,0.15) 0px 2px 6px 2px",
      display: "none",
      visibility: "visible",
      opacity: "0",
      transformOrigin:
        bubbleButtonAlign === "left"
          ? "left bottom"
          : "right bottom",
      transform: "translateZ(0) scale(0.96)",
      willChange:
        "width, height, top, left, opacity, transform",
      userSelect: "none",
      maxWidth: "none",
      maxHeight: "none",
      WebkitOverflowScrolling: "touch",
    });

    applyRect(normalRect(), false);

    document.body.appendChild(iframe);
  }

  function sendMessageToIframe(type, value) {
    if (!iframe || !iframe.contentWindow) {
      return;
    }

    iframe.contentWindow.postMessage(
      {
        type: type,
        value: value,
      },
      "*"
    );
  }

  // =========================================================
  // OPEN / CLOSE
  // =========================================================
  function openChatbot() {
    if (!bubble) {
      return;
    }

    // API chưa load xong
    if (!iframe) {
      console.warn("[OWLLA] Chatbot đang tải...");
      return;
    }

    isOpen = true;

    iframe.style.display = "block";
    iframe.style.visibility = "visible";

    if (!isExpanded) {
      applyRect(normalRect(), false);
    }

    nextFrame(function () {
      if (!iframe) {
        return;
      }

      iframe.style.opacity = "1";
      iframe.style.transform =
        "translateZ(0) scale(1)";
    });

    setBubbleContent(true);
    showBubble(true);
  }

  function closeChatbot() {
    if (!iframe || !bubble) {
      return;
    }

    isOpen = false;

    if (isExpanded) {
      isExpanded = false;

      sendMessageToIframe(
        "OWLLA_CHATBOT_FULLSCREEN_STATE",
        false
      );
    }

    iframe.style.opacity = "0";
    iframe.style.transform =
      "translateZ(0) scale(0.96)";

    setBubbleContent(false);
    showBubble(true);

    window.setTimeout(function () {
      if (isOpen || !iframe) {
        return;
      }

      iframe.style.display = "none";
      applyRect(normalRect(), false);
    }, 220);
  }

  // =========================================================
  // FULLSCREEN
  // =========================================================
  function expandChatbot() {
    if (!enableFullscreen || !iframe || isExpanded) {
      return;
    }

    isExpanded = true;

    iframe.style.display = "block";
    iframe.style.visibility = "visible";
    iframe.style.opacity = "1";
    iframe.style.transform =
      "translateZ(0) scale(1)";

    applyRect(normalRect(), false);

    void iframe.offsetWidth;

    showBubble(false);

    nextFrame(function () {
      applyRect(fullRect(), true);
    });

    sendMessageToIframe(
      "OWLLA_CHATBOT_FULLSCREEN_STATE",
      true
    );
  }

  function collapseChatbot(withBubble) {
    if (!iframe || !isExpanded) {
      return;
    }

    isExpanded = false;

    applyRect(fullRect(), false);

    void iframe.offsetWidth;

    nextFrame(function () {
      applyRect(normalRect(), true);
    });

    if (withBubble !== false) {
      window.setTimeout(function () {
        showBubble(true);
      }, DURATION - 160);
    }

    sendMessageToIframe(
      "OWLLA_CHATBOT_FULLSCREEN_STATE",
      false
    );
  }

  // =========================================================
  // RESIZE / IPHONE ORIENTATION
  // =========================================================
  function setupResizeHandler() {
    var raf = null;

    function updateSize() {
      if (!iframe || !isOpen) {
        return;
      }

      if (raf) {
        window.cancelAnimationFrame(raf);
      }

      raf = window.requestAnimationFrame(function () {
        applyRect(
          isExpanded ? fullRect() : normalRect(),
          false
        );
      });
    }

    window.addEventListener("resize", updateSize);

    window.addEventListener(
      "orientationchange",
      function () {
        window.setTimeout(updateSize, 300);
      }
    );

    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        "resize",
        updateSize
      );

      window.visualViewport.addEventListener(
        "scroll",
        updateSize
      );
    }
  }

  // =========================================================
  // MESSAGES FROM IFRAME
  // =========================================================
  function setupMessageListener() {
    window.addEventListener(
      "message",
      function (event) {
        if (
          !iframe ||
          event.source !== iframe.contentWindow
        ) {
          return;
        }

        var message = event.data;

        if (
          !message ||
          typeof message !== "object"
        ) {
          return;
        }

        if (
          message.type ===
          "OWLLA_CHATBOT_FULLSCREEN"
        ) {
          if (!enableFullscreen) {
            return;
          }

          if (message.value === true) {
            expandChatbot();
          } else {
            collapseChatbot(true);
          }

          return;
        }

        if (
          message.type ===
          "OWLLA_CHATBOT_RESIZE"
        ) {
          if (!enableFullscreen) {
            return;
          }

          var expanded = false;

          if (
            typeof message.expanded !==
              "undefined" &&
            message.expanded !== null
          ) {
            expanded = message.expanded;
          } else if (
            typeof message.value !==
              "undefined" &&
            message.value !== null
          ) {
            expanded = message.value;
          }

          if (expanded === true) {
            expandChatbot();
          } else {
            collapseChatbot(true);
          }
        }
      }
    );
  }

  // =========================================================
  // FETCH API
  // =========================================================
  function fetchAgentInfo(id) {
    var controller = null;
    var timeout = null;

    var options = {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
    };

    if (window.AbortController) {
      controller = new AbortController();

      timeout = window.setTimeout(function () {
        controller.abort();
      }, 10000);

      options.signal = controller.signal;
    }

    return fetch(
      chatDomain +
        "/api/chat-website/get-agent-info?agent_id=" +
        encodeURIComponent(id),
      options
    )
      .then(function (response) {
        if (timeout) {
          window.clearTimeout(timeout);
        }

        if (!response.ok) {
          throw new Error(
            "API error: " + response.status
          );
        }

        return response.json();
      })
      .catch(function (error) {
        if (timeout) {
          window.clearTimeout(timeout);
        }

        throw error;
      });
  }

  // =========================================================
  // INIT
  // =========================================================
  function init(id, width, height, domain, lang) {
    chatDomain =
      domain ||
      "https://owlla-dev.thinklabs.com.vn";

    // Bỏ dấu / cuối domain
    chatDomain = chatDomain.replace(/\/+$/, "");

    chatLang = lang || "vi";
    originalWidth = width || "450px";
    originalHeight = height || "550px";

    // QUAN TRỌNG:
    // Tạo bubble NGAY, không chờ API
    createBubble();
    setupResizeHandler();
    setupMessageListener();

    fetchAgentInfo(id)
      .then(function (data) {
        bubbleButtonAlign =
          data.bubble_button_align || "right";

        bubbleButtonColor =
          data.bubble_button_color ||
          bubbleButtonColor;

        updateBubblePosition();

        // Load avatar
        if (data.avatar_uri) {
          avatarImg = document.createElement("img");

          avatarImg.src =
            chatDomain +
            "/" +
            String(data.avatar_uri).replace(
              /^\/+/,
              ""
            );

          avatarImg.alt = "";

          Object.assign(avatarImg.style, {
            width: "60px",
            height: "60px",
            padding: "1px",
            backgroundColor: bubbleButtonColor,
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
            boxSizing: "border-box",
          });

          avatarImg.onload = function () {
            if (!isOpen) {
              setBubbleContent(false);
            }
          };

          avatarImg.onerror = function () {
            console.warn(
              "[OWLLA] Không tải được avatar"
            );
          };
        }

        // Tạo iframe SAU khi lấy config thành công
        var iframeUrl =
          chatDomain +
          "/chatbot-iframe/" +
          encodeURIComponent(id) +
          "?lang=" +
          encodeURIComponent(chatLang) +
          "&fullscreen=" +
          (enableFullscreen ? "true" : "false");

        createIframe(iframeUrl);

        if (!isOpen) {
          setBubbleContent(false);
        }

        if (data.is_auto_open_bubble === true) {
          openChatbot();
        }
      })
      .catch(function (error) {
        // API lỗi vẫn giữ bubble trên iPhone
        console.error(
          "[OWLLA] INIT ERROR:",
          error
        );

        console.error(
          "[OWLLA] API URL:",
          chatDomain +
            "/api/chat-website/get-agent-info?agent_id=" +
            encodeURIComponent(id)
        );

        // Bubble vẫn hiển thị chat icon
        setBubbleContent(false);
      });
  }

  // =========================================================
  // BOOTSTRAP
  // =========================================================
  (function () {
    var script = document.querySelector(
      'script[data-chat-service="Salebot"][data-bot-id]'
    );

    if (!script) {
      console.error(
        "[OWLLA] Chatbot script config not found"
      );
      return;
    }

    var botId =
      script.getAttribute("data-bot-id");

    if (!botId) {
      console.error("[OWLLA] Bot ID is missing");
      return;
    }

    var width =
      script.getAttribute("data-chat-width") ||
      "450px";

    var height =
      script.getAttribute("data-chat-height") ||
      "550px";

    var domain =
      script.getAttribute("data-chat-domain") ||
      "https://owlla-dev.thinklabs.com.vn";

    var lang =
      script.getAttribute("data-lang") ||
      "vi";

    enableFullscreen =
      script.getAttribute("data-chat-fullscreen") ===
      "true";

    var scriptBubbleColor =
      script.getAttribute("data-bubble-color");

    if (scriptBubbleColor) {
      bubbleButtonColor = scriptBubbleColor;
    }

    ready(function () {
      init(
        botId,
        width,
        height,
        domain,
        lang
      );
    });
  })();
})();
