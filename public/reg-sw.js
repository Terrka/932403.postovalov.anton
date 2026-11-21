if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker зарегистрирован, область действия (scope):', registration.scope);
      })
      .catch((error) => {
        console.error('Ошибка регистрации Service Worker:', error);
      });
  });
}