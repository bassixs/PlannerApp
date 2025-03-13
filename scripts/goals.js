class GoalManager {
    constructor() {
        this.goals = Storage.load('goals') || [];
        this.render();
    }

    addGoal(title, dueDate) {
        const goal = {
            id: Date.now(),
            title,
            dueDate,
            completed: false
        };
        this.goals.push(goal);
        Storage.save('goals', this.goals);
        this.render();
    }

    render() {
        const goalsContainer = document.getElementById('goals');
        if (!goalsContainer) {
            console.error('Goals container not found');
            return;
        }

        goalsContainer.innerHTML = `
            <div class="goal-list">
                ${Array.isArray(this.goals) && this.goals.length ? this.goals.map(goal => `
                    <div class="card goal-card ${goal.completed ? 'completed' : ''}" data-id="${goal.id}">
                        <h3>${goal.title}</h3>
                        <p>Срок: ${goal.dueDate || 'Не указан'}</p>
                    </div>
                `).join('') : '<p>Нет целей</p>'}
            </div>
        `;
    }
}

const goalManager = new GoalManager();