export function registerServiceWorker(appWindow: Window = window) {
  if (!("serviceWorker" in appWindow.navigator)) {
    return;
  }

  appWindow.addEventListener("load", () => {
    void appWindow.navigator.serviceWorker.register("/sw.js");
  });
}
