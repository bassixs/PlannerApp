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
            progress: 0
        };
        this.habits.push(habit);
        Storage.save('habits', this.habits);
        this.render();
    }

    render() {
        const habitsContainer = document.getElementById('habits');
        if (!habitsContainer) {
            console.error('Habits container not found');
            return;
        }

        habitsContainer.innerHTML = `
            <div class="habit-list">
                ${Array.isArray(this.habits) && this.habits.length ? this.habits.map(habit => `
                    <div class="card habit-card" data-id="${habit.id}">
                        <h3>${habit.title}</h3>
                        <p>Частота: каждые ${habit.frequency} дней</p>
                        <p>Прогресс: ${habit.progress}%</p>
                    </div>
                `).join('') : '<p>Нет привычек</p>'}
            </div>
        `;
    }
}

const habitManager = new HabitManager();