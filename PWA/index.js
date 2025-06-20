document.addEventListener('DOMContentLoaded', async () => {
    await DynamicLoader.loadScript("App/App.js");

    const app = new App();
    app.container = document.querySelector("#app-container");
    app.start();
});
