(function () {
  if (!("serviceWorker" in navigator)) return;

  var reloading = false;
  var registration;

  navigator.serviceWorker.addEventListener("controllerchange", function () {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });

  function activateWaitingWorker() {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
  }

  function checkForUpdate() {
    if (!registration || !navigator.onLine) return;
    registration.update().then(activateWaitingWorker).catch(function () {});
  }

  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("./sw.js", { updateViaCache: "none" })
      .then(function (value) {
        registration = value;
        activateWaitingWorker();
        checkForUpdate();

        registration.addEventListener("updatefound", function () {
          var worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", function () {
            if (worker.state === "installed") activateWaitingWorker();
          });
        });
      })
      .catch(function () {});

    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(function () {});
    }
  });

  window.addEventListener("online", checkForUpdate);
  window.addEventListener("pageshow", checkForUpdate);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") checkForUpdate();
  });
  window.setInterval(checkForUpdate, 30 * 60 * 1000);
})();
