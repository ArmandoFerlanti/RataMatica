class GestioneFinanze {
    #container = undefined;
    #components = {};

    constructor() {}

    show() {
        this.#renderList();
    }

    #renderList() {
        const data = this.#getData();
        const debts = data.filter(item => item.type === 'debt');
        const services = data.filter(item => item.type === 'service');

        this.#components.debtsList.innerHTML = debts.length
            ? debts.map(this.#createItemHTML).join('')
            : `<p class="text-muted">Nessun debito aggiunto.</p>`;

        this.#components.servicesList.innerHTML = services.length
            ? services.map(this.#createItemHTML).join('')
            : `<p class="text-muted">Nessun servizio aggiunto.</p>`;

        const totalDebts = debts.reduce((sum, item) => sum + item.amount, 0);
        const totalServices = services.reduce((sum, item) => sum + item.amount, 0);
        const totalMonthly = totalDebts + totalServices;

        this.#components.monthlyTotal.textContent = `Totale mensile da pagare: €${totalMonthly.toFixed(2)}`;
    }

    #createItemHTML(item) {
        const due = item.dueDate ? new Date(item.dueDate).toLocaleDateString('it-IT') : 'N/A';
        const typeIcon = item.type === 'debt' ? '💰' : '🔁';

        const paid = item.paidRates || 0;
        const remaining = item.totalRates ? (item.totalRates - paid) : 0;
        const remainingAmount = remaining * item.amount;
        const progressPercent = item.totalRates ? (paid / item.totalRates) * 100 : 0;

        return `
            <div class="col-12 card ${item.type === 'debt' ? 'card-debt' : 'card-service'} d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h5>${typeIcon} ${item.title}</h5>
                <button class="btn btn-sm btn-danger btn-delete" data-id="${item.id}">Elimina</button>
            </div>
            <p>Importo rata: €${item.amount.toFixed(2)}</p>
            <p>Numero rate totali: ${item.totalRates || 'N/A'}</p>
            <p>Rate pagate: ${paid}</p>
            <p>Importo residuo: €${remainingAmount.toFixed(2)}</p>
            <p>Scadenza: ${due}</p>

            <div class="progress mb-2" style="height: 20px;">
                <div class="progress-bar" role="progressbar" style="width: ${progressPercent}%" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100">${progressPercent.toFixed(0)}%</div>
            </div>

            <div class="btn-group" role="group" aria-label="Modifica rate pagate">
                <button class="btn btn-sm btn-outline-primary btn-decrease" data-id="${item.id}">-</button>
                <button class="btn btn-sm btn-outline-primary btn-increase" data-id="${item.id}">+</button>
            </div>
            </div>
        `;
    }

    init() {
        this.#container = document.querySelector("#divGestioneFinanze");
        this.#createComponents();
        this.#setEvents();
    }

    #createComponents() {
        this.#components.form = this.#container.querySelector('#finance-form');
        this.#components.debtsList = this.#container.querySelector('#debts-list');
        this.#components.servicesList = this.#container.querySelector('#services-list');
        this.#components.monthlyTotal = this.#container.querySelector('#monthly-total');
        this.#components.typeSelect = this.#container.querySelector('#type');
        this.#components.debtDetails = this.#container.querySelector('#debt-details');
    }

    #setEvents() {
        this.#components.typeSelect.addEventListener('change', (e) => this.#toggleDebtDetails(e));
        this.#components.debtsList.addEventListener('click', (e) => this.#handleListClick(e));
        this.#components.servicesList.addEventListener('click', (e) => this.#handleListClick(e));

        this.#components.form.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = this.#components.form.title.value.trim();
            const amount = parseFloat(this.#components.form.monthlyAmount.value);
            const totalRates = parseInt(this.#components.form.totalRates.value);
            const dueDate = this.#components.form.dueDate.value;
            const type = this.#components.form.type.value;

            if (!title || isNaN(amount)) {
                alert('Inserisci un titolo e un importo validi.');
                return;
            }

            if (type === 'debt' && (isNaN(totalRates) || !dueDate)) {
                alert('Per i debiti, inserisci numero rate e data di scadenza.');
                return;
            }

            const newItem = {
                id: Date.now(),
                title,
                amount,
                totalRates: type === 'debt' ? totalRates : null,
                dueDate: type === 'debt' ? dueDate : null,
                type,
                paidRates: 0
            };

            const data = this.#getData();
            data.push(newItem);
            this.#saveData(data);

            this.#components.form.reset();
            this.#toggleDebtDetails();
            this.#renderList();
        });
    }

    #toggleDebtDetails() {
        if (this.#components.typeSelect.value === 'debt') {
            this.#components.debtDetails.style.display = 'flex';
            document.getElementById('totalRates').required = true;
            document.getElementById('dueDate').required = true;
        } else {
            this.#components.debtDetails.style.display = 'none';
            document.getElementById('totalRates').required = false;
            document.getElementById('dueDate').required = false;
        }
    }

    #handleListClick(e) {
        const id = Number(e.target.dataset.id);
        let data = this.#getData();

        const index = data.findIndex(i => i.id === id);
        if (index === -1) return;

        const item = data[index];

        if (e.target.classList.contains('btn-delete')) {
            data.splice(index, 1);
            this.#saveData(data);
            this.#renderList();
            return;
        }

        if (e.target.classList.contains('btn-increase')) {
            if (item.paidRates < item.totalRates) {
                item.paidRates++;
                if (item.paidRates === item.totalRates) {
                    data.splice(index, 1); // elimina il debito estinto
                }
                this.#saveData(data);
                this.#renderList();
            }
            return;
        }

        if (e.target.classList.contains('btn-decrease')) {
            if (item.paidRates > 0) {
                item.paidRates--;
                this.#saveData(data);
                this.#renderList();
            }
            return;
        }
    }

    #getData() {
        const data = localStorage.getItem('finances');
        return data ? JSON.parse(data) : [];
    }

    #saveData(data) {
        localStorage.setItem('finances', JSON.stringify(data));
    }
}