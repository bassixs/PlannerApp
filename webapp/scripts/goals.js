class GoalManager {
    constructor() {
        this.goals = Storage.load('goals') || [];
        this.render();
    }

    addGoal(title, deadline) {
        const goal = {
            id: Date.now(),
            title,
            deadline,
            progress: 0
        };
        this.goals.push(goal);
        Storage.save('goals', this.goals);
        this.render();
    }

    render() {
        const container = document.getElementById('goals');
        container.innerHTML = `
            <button onclick="Modal.showGoalForm()">Add Goal</button>
            ${this.goals.map(goal => `
                <div class="card">
                    <span>${goal.title}</span>
                    <small>Deadline: ${goal.deadline}</small>
                    <span>Progress: ${goal.progress}%</span>
                </div>
            `).join('')}
        `;
    }
}

const goalManager = new GoalManager();
