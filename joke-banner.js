(function () {
  "use strict";

  function mountJokeBanner() {
    if (document.getElementById("joke-app-banner")) return;

    var style = document.createElement("style");
    style.id = "joke-app-banner-styles";
    style.textContent =
      "#joke-app-banner{" +
      "position:relative;" +
      "display:block;box-sizing:border-box;width:100%;" +
      "margin:16px 0 0;padding:8px 16px 10px;" +
      "background:transparent;color:#666;" +
      "font:400 13px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;" +
      "text-align:center;" +
      "}" +
      "@media(max-width:520px){" +
      "#joke-app-banner{margin-top:12px;padding:6px 12px 8px;font-size:12px}" +
      "}";

    var banner = document.createElement("aside");
    banner.id = "joke-app-banner";
    banner.setAttribute("role", "note");
    banner.setAttribute("aria-label", "О приложении");
    banner.textContent = "Это шуточное приложение, не настоящий банк.";

    document.head.appendChild(style);
    var footerHost =
      document.querySelector("main.scaffold__main") ||
      document.querySelector(".admin-container") ||
      document.body;
    footerHost.appendChild(banner);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountJokeBanner);
  } else {
    mountJokeBanner();
  }
})();
