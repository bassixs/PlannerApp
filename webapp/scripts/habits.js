class HabitManager {
    constructor() {
        this.habits = Storage.load('habits') || [];
        this.render();
    }

    addHabit(title, frequency) {
        const habit = {
            id: Date.now(),
            title,
            frequency,
            streak: 0,
            lastCompleted: null
        };
        this.habits.push(habit);
        Storage.save('habits', this.habits);
        this.render();
    }

    render() {
        const container = document.getElementById('habits');
        container.innerHTML = `
            <button class="add-btn" onclick="Modal.showHabitForm()">Добавить привычку</button>
            ${this.habits.map(habit => `
                <div class="card">
                    <span>${habit.title}</span>
                    <small>Частота: ${habit.frequency}</small>
                    <span>Серия: ${habit.streak}</span>
                </div>
            `).join('')}
        `;
    }
}

const habitManager = new HabitManager();