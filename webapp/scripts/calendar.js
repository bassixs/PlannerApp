class Calendar {
    constructor() {
        this.render();
    }

    render() {
        const container = document.getElementById('calendar');
        container.innerHTML = `
            <div class="card">
                <h3>Calendar View</h3>
                <!-- Здесь будет интеграция с задачами -->
                <p>Coming soon: Full calendar integration</p>
            </div>
        `;
    }
}

const calendar = new Calendar();