class TaskManager {
    constructor() {
        this.activeTasks = Storage.load('tasks') || [];
        this.completedTasks = Storage.load('completed') || [];
        console.log('TaskManager initialized with active tasks:', this.activeTasks);
        console.log('TaskManager initialized with completed tasks:', this.completedTasks);
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
        this.activeTasks.push(task);
        Storage.save('tasks', this.activeTasks);
        this.render();
        Notifications.schedule(task.description, dueDate);
    }

    editTask(id, updatedTask) {
        const taskIndex = this.activeTasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            this.activeTasks[taskIndex] = { ...this.activeTasks[taskIndex], ...updatedTask };
        } else {
            const completedIndex = this.completedTasks.findIndex(task => task.id === id);
            if (completedIndex !== -1) {
                this.completedTasks[completedIndex] = { ...this.completedTasks[completedIndex], ...updatedTask };
            }
        }
        Storage.save('tasks', this.activeTasks);
        Storage.save('completed', this.completedTasks);
        this.render();
    }

    toggleTask(id) {
        const activeTask = this.activeTasks.find(task => task.id === id);
        if (activeTask) {
            activeTask.completed = !activeTask.completed;
            if (activeTask.completed) {
                // Переносим задачу в завершенные
                this.completedTasks.push(this.activeTasks.splice(this.activeTasks.indexOf(activeTask), 1)[0]);
                // Анимация и уведомление
                const taskCard = document.querySelector(`.task-card[data-id="${id}"]`);
                if (taskCard) {
                    taskCard.style.animation = 'completeTask 0.5s ease forwards';
                    setTimeout(() => Notifications.schedule('АНО гордится тобой!', new Date().toLocaleString()), 500);
                }
            }
            Storage.save('tasks', this.activeTasks);
            Storage.save('completed', this.completedTasks);
            this.render();
        }
    }

    deleteTask(id) {
        const activeIndex = this.activeTasks.findIndex(task => task.id === id);
        if (activeIndex !== -1) {
            this.activeTasks.splice(activeIndex, 1);
        } else {
            const completedIndex = this.completedTasks.findIndex(task => task.id === id);
            if (completedIndex !== -1) {
                this.completedTasks.splice(completedIndex, 1);
            }
        }
        Storage.save('tasks', this.activeTasks);
        Storage.save('completed', this.completedTasks);
        this.render();
    }

    render() {
        const tasksContainer = document.getElementById('tasks');
        const completedContainer = document.getElementById('completed');
        if (!tasksContainer || !completedContainer) {
            console.error('Контейнеры задач не найдены');
            return;
        }
        console.log('Rendering active tasks:', this.activeTasks);
        console.log('Rendering completed tasks:', this.completedTasks);

        tasksContainer.innerHTML = `
            <button class="add-task-btn" id="add-task-btn">Добавить задачу</button>
            <div class="task-list" id="task-list">
                ${Array.isArray(this.activeTasks) ? this.activeTasks.map(task => `
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
                `).join('') : '<p>Нет активных задач</p>'}
            </div>
        `;

        completedContainer.innerHTML = `
            <div class="task-list" id="completed-list">
                ${Array.isArray(this.completedTasks) ? this.completedTasks.map(task => `
                    <div class="card task-card completed" data-id="${task.id}" draggable="true">
                        <input type="checkbox" checked class="task-checkbox" disabled>
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
                `).join('') : '<p>Нет завершенных задач</p>'}
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
        const tasksContainer = document.getElementById('tasks');
        const addButton = tasksContainer.querySelector('#add-task-btn');
        if (addButton) {
            addButton.addEventListener('click', () => Modal.showTaskForm());
            if (window.Telegram?.WebApp) {
                addButton.addEventListener('touchstart', (e) => {
                    e.preventDefault(); // Предотвращаем стандартное поведение
                    Modal.showTaskForm();
                }, { passive: false });
            }
        }

        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const id = parseInt(e.target.closest('.task-card').dataset.id);
                this.toggleTask(id);
            });
            if (window.Telegram?.WebApp) {
                checkbox.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    checkbox.checked = !checkbox.checked;
                    const id = parseInt(e.target.closest('.task-card').dataset.id);
                    this.toggleTask(id);
                }, { passive: false });
            }
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.deleteTask(id);
            });
            if (window.Telegram?.WebApp) {
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const id = parseInt(e.target.dataset.id);
                    this.deleteTask(id);
                }, { passive: false });
            }
        });

        document.querySelectorAll('.task-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('task-checkbox') && !e.target.classList.contains('delete-btn')) {
                    const id = parseInt(card.dataset.id);
                    const task = this.activeTasks.find(t => t.id === id) || this.completedTasks.find(t => t.id === id);
                    if (task) Modal.showEditTaskForm(task);
                }
            });
            if (window.Telegram?.WebApp) {
                card.addEventListener('touchstart', (e) => {
                    if (!e.target.classList.contains('task-checkbox') && !e.target.classList.contains('delete-btn')) {
                        e.preventDefault();
                        const id = parseInt(card.dataset.id);
                        const task = this.activeTasks.find(t => t.id === id) || this.completedTasks.find(t => t.id === id);
                        if (task) Modal.showEditTaskForm(task);
                    }
                }, { passive: false });
            }
        });
    }

    setupDragAndDrop() {
        const taskList = document.getElementById('task-list');
        const completedList = document.getElementById('completed-list');
        if (!taskList || !completedList) return;

        const handleDragStart = (e) => {
            const taskCard = e.target.closest('.task-card');
            if (taskCard && !window.Telegram?.WebApp) { // Drag and Drop только для ПК
                e.dataTransfer.setData('text/plain', taskCard.dataset.id);
                taskCard.classList.add('dragging');
            } else if (window.Telegram?.WebApp) {
                this.handleTouchDragStart(taskCard);
            }
        };

        const handleDragEnd = (e) => {
            const taskCard = e.target.closest('.task-card');
            if (taskCard) {
                taskCard.classList.remove('dragging');
            }
        };

        const handleDragOver = (e) => {
            e.preventDefault();
        };

        const handleDrop = (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            const draggedTask = document.querySelector(`.task-card[data-id="${id}"]`);
            const targetContainer = e.target.closest('.task-list') || e.target.closest('#completed-list');
            const isCompleted = targetContainer.id === 'completed-list';

            if (draggedTask && targetContainer && !window.Telegram?.WebApp) {
                const draggedTaskData = this.activeTasks.find(task => task.id === parseInt(id)) || this.completedTasks.find(task => task.id === parseInt(id));
                if (draggedTaskData) {
                    if (isCompleted && this.activeTasks.includes(draggedTaskData)) {
                        draggedTaskData.completed = true;
                        this.completedTasks.push(this.activeTasks.splice(this.activeTasks.indexOf(draggedTaskData), 1)[0]);
                    } else if (!isCompleted && this.completedTasks.includes(draggedTaskData)) {
                        draggedTaskData.completed = false;
                        this.activeTasks.push(this.completedTasks.splice(this.completedTasks.indexOf(draggedTaskData), 1)[0]);
                    }
                    Storage.save('tasks', this.activeTasks);
                    Storage.save('completed', this.completedTasks);
                    this.render();
                }
            }
        };

        taskList.addEventListener('dragstart', handleDragStart);
        taskList.addEventListener('dragend', handleDragEnd);
        taskList.addEventListener('dragover', handleDragOver);
        taskList.addEventListener('drop', handleDrop);

        completedList.addEventListener('dragstart', handleDragStart);
        completedList.addEventListener('dragend', handleDragEnd);
        completedList.addEventListener('dragover', handleDragOver);
        completedList.addEventListener('drop', handleDrop);

        if (window.Telegram?.WebApp) {
            this.setupTouchDragAndDrop();
        }
    }

    setupTouchDragAndDrop() {
        let touchStartX = 0;
        let touchStartY = 0;
        let draggedTask = null;

        document.querySelectorAll('.task-card').forEach(card => {
            card.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                draggedTask = card;
                draggedTask.classList.add('dragging');
            }, { passive: true });

            card.addEventListener('touchmove', (e) => {
                if (draggedTask) {
                    const touchX = e.touches[0].clientX;
                    const touchY = e.touches[0].clientY;
                    const deltaX = touchX - touchStartX;
                    const deltaY = touchY - touchStartY;
                    if (Math.abs(deltaY) > 10) { // Минимальное расстояние для перетаскивания
                        draggedTask.style.position = 'absolute';
                        draggedTask.style.left = `${touchX - draggedTask.offsetWidth / 2}px`;
                        draggedTask.style.top = `${touchY - draggedTask.offsetHeight / 2}px`;
                    }
                }
            }, { passive: true });

            card.addEventListener('touchend', (e) => {
                if (draggedTask) {
                    const touchEndY = e.changedTouches[0].clientY;
                    const targetContainer = document.elementFromPoint(e.changedTouches[0].clientX, touchEndY).closest('.task-list') || document.elementFromPoint(e.changedTouches[0].clientX, touchEndY).closest('#completed-list');
                    const isCompleted = targetContainer && targetContainer.id === 'completed-list';
                    const id = parseInt(draggedTask.dataset.id);
                    const draggedTaskData = this.activeTasks.find(task => task.id === id) || this.completedTasks.find(task => task.id === id);

                    if (draggedTaskData && targetContainer) {
                        if (isCompleted && this.activeTasks.includes(draggedTaskData)) {
                            draggedTaskData.completed = true;
                            this.completedTasks.push(this.activeTasks.splice(this.activeTasks.indexOf(draggedTaskData), 1)[0]);
                        } else if (!isCompleted && this.completedTasks.includes(draggedTaskData)) {
                            draggedTaskData.completed = false;
                            this.activeTasks.push(this.completedTasks.splice(this.completedTasks.indexOf(draggedTaskData), 1)[0]);
                        }
                        Storage.save('tasks', this.activeTasks);
                        Storage.save('completed', this.completedTasks);
                        this.render();
                    }

                    draggedTask.style.position = '';
                    draggedTask.style.left = '';
                    draggedTask.style.top = '';
                    draggedTask.classList.remove('dragging');
                    draggedTask = null;
                }
            }, { passive: true });
        });
    }
}

const taskManager = new TaskManager();