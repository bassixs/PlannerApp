class CalendarManager {
    constructor() {
        this.events = Storage.load('calendar') || [];
        this.render();
    }

    addEvent(title, date) {
        const event = {
            id: Date.now(),
            title,
            date
        };
        this.events.push(event);
        Storage.save('calendar', this.events);
        this.render();
    }

    render() {
        const calendarContainer = document.getElementById('calendar');
        if (!calendarContainer) {
            console.error('Calendar container not found');
            return;
        }

        calendarContainer.innerHTML = `
            <div class="calendar-list">
                ${Array.isArray(this.events) && this.events.length ? this.events.map(event => `
                    <div class="card event-card" data-id="${event.id}">
                        <h3>${event.title}</h3>
                        <p>Дата: ${event.date}</p>
                    </div>
                `).join('') : '<p>Нет событий</p>'}
            </div>
        `;
    }
}

const calendarManager = new CalendarManager();