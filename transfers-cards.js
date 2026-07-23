// Enables closing recipient cards in Main -> "Переводы"
(function () {
  var STORAGE_KEY = "pwa-main-hidden-transfer-cards";

  function loadHiddenNames() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveHiddenNames(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  }

  function getTransferRoot() {
    return document.getElementById("TRANSFERS");
  }

  function getCardName(card) {
    var link = card && card.querySelector("a[aria-label]");
    return link ? String(link.getAttribute("aria-label") || "").trim() : "";
  }

  function isClosableCard(card) {
    if (!card) return false;
    if (!card.querySelector('button[aria-label="Удалить операцию"]')) return false;
    return !!getCardName(card);
  }

  function hideCard(card) {
    if (!card || card.getAttribute("data-transfer-card-hidden") === "1") return;
    card.setAttribute("data-transfer-card-hidden", "1");
    card.style.display = "none";
  }

  function hideStoredCards() {
    var root = getTransferRoot();
    if (!root) return;
    var hidden = loadHiddenNames();
    if (!hidden.length) return;
    var hiddenSet = {};
    for (var i = 0; i < hidden.length; i++) hiddenSet[hidden[i]] = true;

    root.querySelectorAll(".Ojm6HCr7").forEach(function (card) {
      var name = getCardName(card);
      if (name && hiddenSet[name]) hideCard(card);
    });
  }

  function rememberAndHide(card) {
    var name = getCardName(card);
    if (!name) return;
    var hidden = loadHiddenNames();
    if (hidden.indexOf(name) === -1) {
      hidden.push(name);
      saveHiddenNames(hidden);
    }
    hideCard(card);
  }

  function bindCloseAction() {
    var root = getTransferRoot();
    if (!root || root.getAttribute("data-transfer-card-bound") === "1") return;

    root.setAttribute("data-transfer-card-bound", "1");
    root.addEventListener("click", function (event) {
      var btn = event.target.closest('button[aria-label="Удалить операцию"]');
      if (!btn || !root.contains(btn)) return;

      var card = btn.closest(".Ojm6HCr7");
      if (!isClosableCard(card)) return;

      event.preventDefault();
      event.stopPropagation();
      rememberAndHide(card);
    });
  }

  function observeTransferCards() {
    var root = getTransferRoot();
    if (!root || root.getAttribute("data-transfer-card-observer") === "1") return;

    root.setAttribute("data-transfer-card-observer", "1");
    var observer = new MutationObserver(function () {
      hideStoredCards();
    });
    observer.observe(root, { childList: true, subtree: true });
  }

  function init() {
    bindCloseAction();
    hideStoredCards();
    observeTransferCards();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
