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

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
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
            <div class="task-list" id="task-list">
                ${Array.isArray(this.tasks) ? this.tasks.map(task => `
                    <div class="card task-card ${task.completed ? 'completed' : ''}" data-id="${task.id}" draggable="true">
                        <input type="checkbox" 
                            ${task.completed ? 'checked' : ''} 
                            class="task-checkbox">
                        <button class="delete-btn" data-id="${task.id}">Удалить</button>
                        <div class="task-content">
                            <h3>${task.description}</h3>
                            <small>Срок: ${task.dueDate || 'Не указан'}</small>
                            <span class="priority priority-${task.priority}">Приоритет: ${this.translatePriority(task.priority)}</span>
                            ${task.taskDescription ? `<p class="description">Описание: ${task.taskDescription}</p>` : ''}
                            ${task.status ? `<p class="status">Статус: ${this.translateStatus(task.status)}</p>` : ''}
                            ${task.assignee ? `<p class="assignee">Исполнитель: ${task.assignee}</p>` : ''}
                            ${task.location ? `<p class="location">Площадка: ${task.location}</p>` : ''}
                            ${task.tags.length ? `<p class="tags">Метки: ${task.tags.join(', ')}</p>` : ''}
                        </div>
                    </div>
                `).join('') : '<p>Нет задач для отображения</p>'}
            </div>
        `;
        this.bindEvents();
        this.setupDragAndDrop();
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

        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.deleteTask(id);
            });
        });

        container.querySelectorAll('.task-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('task-checkbox') && !e.target.classList.contains('delete-btn')) {
                    const id = parseInt(card.dataset.id);
                    const task = this.tasks.find(t => t.id === id);
                    if (task) Modal.showEditTaskForm(task);
                }
            });
            if (window.Telegram?.WebApp) {
                card.addEventListener('touchstart', (e) => {
                    if (!e.target.classList.contains('task-checkbox') && !e.target.classList.contains('delete-btn')) {
                        const id = parseInt(card.dataset.id);
                        const task = this.tasks.find(t => t.id === id);
                        if (task) Modal.showEditTaskForm(task);
                    }
                });
            }
        });
    }

    setupDragAndDrop() {
        const taskList = document.getElementById('task-list');
        if (!taskList) return;

        taskList.addEventListener('dragstart', (e) => {
            const taskCard = e.target.closest('.task-card');
            if (taskCard) {
                e.dataTransfer.setData('text/plain', taskCard.dataset.id);
                taskCard.classList.add('dragging');
            }
        });

        taskList.addEventListener('dragend', (e) => {
            const taskCard = e.target.closest('.task-card');
            if (taskCard) {
                taskCard.classList.remove('dragging');
            }
        });

        taskList.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        taskList.addEventListener('drop', (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            const draggedTask = document.querySelector(`.task-card[data-id="${id}"]`);
            const targetTask = e.target.closest('.task-card');

            if (draggedTask && targetTask && draggedTask !== targetTask) {
                const draggedIndex = Array.from(taskList.children).indexOf(draggedTask);
                const targetIndex = Array.from(taskList.children).indexOf(targetTask);

                if (draggedIndex !== -1 && targetIndex !== -1) {
                    const tasks = [...this.tasks];
                    const [movedTask] = tasks.splice(draggedIndex, 1);
                    tasks.splice(targetIndex, 0, movedTask);
                    this.tasks = tasks;
                    Storage.save('tasks', this.tasks);
                    this.render();
                }
            }
        });
    }
}

const taskManager = new TaskManager();