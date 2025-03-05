class TaskManager {
    constructor() {
        this.tasks = Storage.load('tasks') || [];
        console.log('TaskManager initialized with tasks:', this.tasks);
        this.render();
    }

    addTask(description, dueDate, priority, taskDescription, status, assignee, location, tags) {
        const task = {
            id: Date.now(),
            description,
            dueDate,
            priority,
            taskDescription,
            status: status || 'in-progress',
            assignee: assignee || '',
            location: location || '',
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag) || [],
            completed: false
        };
        this.tasks.push(task);
        Storage.save('tasks', this.tasks);
        this.render();
        Notifications.schedule(task.description, dueDate);
    }

    editTask(id, updatedTask) {
        this.tasks = this.tasks.map(task => 
            task.id === id ? { ...task, ...updatedTask } : task
        );
        Storage.save('tasks', this.tasks);
        this.render();
    }

    toggleTask(id) {
        this.tasks = this.tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        Storage.save('tasks', this.tasks);
        this.render();
    }

    render() {
        const container = document.getElementById('tasks');
        if (!container) {
            console.error('Контейнер задач не найден');
            return;
        }
        console.log('Rendering tasks:', this.tasks);
        container.innerHTML = `
            <button class="add-task-btn" id="add-task-btn">Добавить задачу</button>
            ${this.tasks.map(task => `
                <div class="card task-card" data-id="${task.id}">
                    <input type="checkbox" 
                        ${task.completed ? 'checked' : ''} 
                        class="task-checkbox">
                    <div class="task-content">
                        <span>${task.description}</span>
                        <small>Срок: ${task.dueDate || 'Не указан'}</small>
                        <span>Приоритет: ${this.translatePriority(task.priority)}</span>
                        ${task.taskDescription ? `<p>Описание: ${task.taskDescription}</p>` : ''}
                        ${task.status ? `<p>Статус: ${this.translateStatus(task.status)}</p>` : ''}
                        ${task.assignee ? `<p>Исполнитель: ${task.assignee}</p>` : ''}
                        ${task.location ? `<p>Площадка: ${task.location}</p>` : ''}
                        ${task.tags.length ? `<p>Метки: ${task.tags.join(', ')}</p>` : ''}
                    </div>
                </div>
            `).join('') || ''}
        `;
        this.bindEvents();
    }

    translatePriority(priority) {
        switch (priority) {
            case 'low': return 'Низкий';
            case 'medium': return 'Средний';
            case 'high': return 'Высокий';
            default: return priority;
        }
    }

    translateStatus(status) {
        switch (status) {
            case 'in-progress': return 'В работе';
            case 'completed': return 'Завершено';
            case 'paused': return 'На паузе';
            default: return status;
        }
    }

    bindEvents() {
        const container = document.getElementById('tasks');
        const addButton = container.querySelector('#add-task-btn');
        if (addButton) {
            addButton.addEventListener('click', () => Modal.showTaskForm());
            if (window.Telegram?.WebApp) {
                addButton.addEventListener('touchstart', () => Modal.showTaskForm());
            }
        }

        container.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const id = parseInt(e.target.closest('.task-card').dataset.id);
                this.toggleTask(id);
            });
        });

        container.querySelectorAll('.task-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('task-checkbox')) {
                    const id = parseInt(card.dataset.id);
                    const task = this.tasks.find(t => t.id === id);
                    if (task) Modal.showEditTaskForm(task);
                }
            });
            if (window.Telegram?.WebApp) {
                card.addEventListener('touchstart', (e) => {
                    if (!e.target.classList.contains('task-checkbox')) {
                        const id = parseInt(card.dataset.id);
                        const task = this.tasks.find(t => t.id === id);
                        if (task) Modal.showEditTaskForm(task);
                    }
                });
            }
        });
    }
}

const taskManager = new TaskManager();