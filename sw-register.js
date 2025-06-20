if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('✅ Service Worker registrato:', reg.scope))
      .catch(err => console.error('❌ Errore nella registrazione del Service Worker:', err));
  });
}
