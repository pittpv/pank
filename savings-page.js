(function () {
  "use strict";

  var TOTAL_KEY = "pwa_savings_total";
  var ACCOUNTS_KEY = "pwa_savings_accounts";
  var DEFAULT_TOTAL = "16 964,99";
  var DEFAULT_ACCOUNTS = [
    {
      name: "Сберегательный счет",
      number: "2838",
      amount: "15 000,22",
      rate: "0,01",
    },
    {
      name: "Вклад «Лучший %»",
      number: "4812",
      amount: "120 000,00",
      rate: "14,5",
    },
    {
      name: "Накопительный счет",
      number: "9074",
      amount: "45 500,00",
      rate: "12",
    },
  ];

  function readAccounts() {
    try {
      var saved = JSON.parse(localStorage.getItem(ACCOUNTS_KEY));
      if (Array.isArray(saved) && saved.length === 3) return saved;
    } catch (e) {}
    return DEFAULT_ACCOUNTS;
  }

  function findTotalElement() {
    var labels = document.querySelectorAll("p");
    for (var i = 0; i < labels.length; i += 1) {
      if (labels[i].textContent.trim() !== "Всего средств") continue;
      var summary = labels[i].closest(".kIormwMN");
      if (summary) return summary.querySelector(".x5LmuIDy");
    }
    return null;
  }

  function setTotal(element, value) {
    if (!element) return;
    var textNode = Array.prototype.find.call(element.childNodes, function (node) {
      return node.nodeType === Node.TEXT_NODE;
    });
    if (textNode) {
      textNode.nodeValue = value + "\u00a0";
    } else {
      element.insertBefore(document.createTextNode(value + "\u00a0"), element.firstChild);
    }
  }

  function renderAccounts(accounts) {
    var list = document.querySelector("#accountsAndIma ul.dKqIH0ou");
    if (!list) return;

    var template = list.querySelector("li");
    if (!template) return;

    var items = accounts.map(function (account) {
      var item = template.cloneNode(true);
      var amount = item.querySelector(".SSSlz0xp");
      var title = item.querySelector(".PLvGm9zM");
      var rate = item.querySelector(".toNPJsam");
      var link = item.querySelector("a");

      if (amount) amount.textContent = account.amount + " ₽";
      if (title) title.textContent = account.name + " •• " + account.number;
      if (rate) rate.textContent = account.rate + "%";
      if (link) {
        link.setAttribute(
          "aria-label",
          account.name +
            " •• " +
            account.number +
            ", " +
            account.amount +
            " ₽, " +
            account.rate +
            "%"
        );
      }
      return item;
    });

    list.replaceChildren.apply(list, items);
  }

  function renderSavings() {
    setTotal(findTotalElement(), localStorage.getItem(TOTAL_KEY) || DEFAULT_TOTAL);
    renderAccounts(readAccounts());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderSavings);
  } else {
    renderSavings();
  }

  window.addEventListener("storage", renderSavings);
  window.addEventListener("pageshow", renderSavings);
  window.addEventListener("savings-config-updated", renderSavings);
})();
