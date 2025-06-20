class App {

    #container = undefined;

    set container(container) {
        this.#container = container;
    }

    constructor() {}

    start() {
        this.#showModuloGestioneFinanze();
    }

    async #showModuloGestioneFinanze() {
        await Promise.all([
            DynamicLoader.loadHTML("App/GestioneFinanze/GestioneFinanze.html", this.#container),
            DynamicLoader.loadCSS("App/GestioneFinanze/GestioneFinanze.css"),
            DynamicLoader.loadScript("App/GestioneFinanze/GestioneFinanze.js"),
        ]);

        const pagina = new GestioneFinanze();
        pagina.init();
        pagina.show();
    }

}