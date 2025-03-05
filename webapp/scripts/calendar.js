class Calendar {
    constructor() {
        this.render();
    }

    render() {
        const container = document.getElementById('calendar');
        container.innerHTML = `
            <div class="card">
                <h3>Календарь</h3>
                <p>Пока в разработке: интеграция с задачами скоро будет добавлена.</p>
            </div>
        `;
    }
}

const calendar = new Calendar();