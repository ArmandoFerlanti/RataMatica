class DynamicLoader {
  // Carica uno script JS, restituisce Promise
  static loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Errore nel caricamento dello script: ${src}`));

      document.head.appendChild(script);
    });
  }

  // Carica un file CSS (sincrono, ma può essere esteso con Promise)
  static loadCSS(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;

    document.head.appendChild(link);
  }

  // Carica un file HTML in un contenitore, async con fetch
  static async loadHTML(url, container) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);

      const html = await response.text();

      container.innerHTML = html;
    } catch (error) {
      console.error(`Errore nel caricamento HTML da "${url}": ${error.message}`);
      throw error;
    }
  }
}