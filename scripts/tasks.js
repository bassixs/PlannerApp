class TaskManager {
    constructor() {
        this.activeTasks = this.migrateTasks(Storage.load('tasks')) || [];
        this.completedTasks = this.migrateTasks(Storage.load('completed')) || [];
        console.log('TaskManager initialized with active tasks:', this.activeTasks);
        console.log('TaskManager initialized with completed tasks:', this.completedTasks);
        this.render();
    }

    migrateTasks(tasks) {
        if (!Array.isArray(tasks)) return [];

        return tasks.map(task => {
            return {
                id: task.id || Date.now(),
                description: task.description || 'Без названия',
                dueDate: task.dueDate || '',
                dueTime: task.dueTime || '',
                priority: task.priority || 'low',
                taskDescription: task.taskDescription || '',
                status: task.status || 'in-progress',
                assignee: task.assignee || '',
                recurrence: task.recurrence || 'none',
                completed: task.completed || false
            };
        });
    }

    addTask(description, dueDate, dueTime, priority, taskDescription, status, assignee, recurrence) {
        const task = {
            id: Date.now(),
            description,
            dueDate,
            dueTime,
            priority,
            taskDescription,
            status: status || 'in-progress',
            assignee: assignee || '',
            recurrence: recurrence || 'none',
            completed: false
        };
        this.activeTasks.push(task);
        Storage.save('tasks', this.activeTasks);
        this.render();
        const fullDueDate = dueDate ? `${dueDate} ${dueTime || '00:00'}` : '';
        Notifications.schedule(task.description, fullDueDate);
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
            activeTask.completed = true;
            this.completedTasks.push(this.activeTasks.splice(this.activeTasks.indexOf(activeTask), 1)[0]);
            Storage.save('tasks', this.activeTasks);
            Storage.save('completed', this.completedTasks);

            if (activeTask.recurrence !== 'none') {
                const newDueDate = this.calculateNextDueDate(activeTask.dueDate, activeTask.recurrence);
                this.addTask(
                    activeTask.description,
                    newDueDate,
                    activeTask.dueTime,
                    activeTask.priority,
                    activeTask.taskDescription,
                    activeTask.status,
                    activeTask.assignee,
                    activeTask.recurrence
                );
            }
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

    calculateNextDueDate(dueDate, recurrence) {
        if (!dueDate) return '';
        const date = new Date(dueDate);
        switch (recurrence) {
            case 'daily':
                date.setDate(date.getDate() + 1);
                break;
            case 'weekly':
                date.setDate(date.getDate() + 7);
                break;
            case 'monthly':
                date.setMonth(date.getMonth() + 1);
                break;
        }
        return date.toISOString().split('T')[0];
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

    translateRecurrence(recurrence) {
        switch (recurrence) {
            case 'none': return 'Однократно';
            case 'daily': return 'Ежедневно';
            case 'weekly': return 'Еженедельно';
            case 'monthly': return 'Ежемесячно';
            default: return recurrence;
        }
    }

    render() {
        const taskList = document.getElementById('task-list');
        const completedContainer = document.getElementById('completed');
        if (!taskList) {
            console.error('Task list container not found:', { taskList });
            document.getElementById('debug').textContent = 'Ошибка: Список задач не найден';
            return;
        }
        if (!completedContainer) {
            console.error('Completed container not found:', { completedContainer });
            document.getElementById('debug').textContent = 'Ошибка: Контейнер завершенных задач не найден';
            return;
        }
        console.log('Rendering active tasks:', this.activeTasks);
        console.log('Rendering completed tasks:', this.completedTasks);

        const sortedActiveTasks = [...this.activeTasks].sort((a, b) => {
            const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

        taskList.innerHTML = `
            <button class="add-task-btn" id="add-task-btn">Добавить задачу</button>
            <div class="task-list-inner">
                ${Array.isArray(sortedActiveTasks) && sortedActiveTasks.length ? sortedActiveTasks.map(task => `
                    <div class="card task-card" data-id="${task.id}" draggable="true">
                        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked disabled' : ''}>
                        <div class="task-content">
                            <h3>${task.description}</h3>
                            <small>Срок: ${task.dueDate ? task.dueDate : 'Не указан'} ${task.dueTime ? `в ${task.dueTime}` : ''}</small>
                            <span class="priority priority-${task.priority}">Приоритет: ${this.translatePriority(task.priority)}</span>
                            ${task.taskDescription ? `<p class="description">Описание: ${task.taskDescription}</p>` : ''}
                            ${task.status ? `<p class="status">Статус: ${this.translateStatus(task.status)}</p>` : ''}
                            ${task.assignee ? `<p class="assignee">Исполнитель: ${task.assignee}</p>` : ''}
                            ${task.recurrence ? `<p class="recurrence">Периодичность: ${this.translateRecurrence(task.recurrence)}</p>` : ''}
                        </div>
                        <div class="delete-icon" data-id="${task.id}">×</div>
                    </div>
                `).join('') : '<p>Нет активных задач</p>'}
            </div>
        `;

        completedContainer.innerHTML = `
            <h4>Завершённые задачи</h4>
            <div class="task-list-inner">
                ${Array.isArray(this.completedTasks) && this.completedTasks.length ? this.completedTasks.map(task => `
                    <div class="card task-card completed" data-id="${task.id}" draggable="true">
                        <input type="checkbox" class="task-checkbox" checked disabled>
                        <div class="task-content">
                            <h3>${task.description}</h3>
                            <small>Срок: ${task.dueDate ? task.dueDate : 'Не указан'} ${task.dueTime ? `в ${task.dueTime}` : ''}</small>
                            <span class="priority priority-${task.priority}">Приоритет: ${this.translatePriority(task.priority)}</span>
                            ${task.taskDescription ? `<p class="description">Описание: ${task.taskDescription}</p>` : ''}
                            ${task.status ? `<p class="status">Статус: ${this.translateStatus(task.status)}</p>` : ''}
                            ${task.assignee ? `<p class="assignee">Исполнитель: ${task.assignee}</p>` : ''}
                            ${task.recurrence ? `<p class="recurrence">Периодичность: ${this.translateRecurrence(task.recurrence)}</p>` : ''}
                        </div>
                        <div class="delete-icon" data-id="${task.id}">×</div>
                    </div>
                `).join('') : '<p>Нет завершенных задач</p>'}
            </div>
        `;

        this.bindEvents();
        this.setupDragAndDrop();
    }

    bindEvents() {
        const taskList = document.getElementById('task-list');
        if (!taskList) {
            console.error('Task list not found for binding events');
            return;
        }

        const addButton = taskList.querySelector('#add-task-btn');
        if (addButton) {
            addButton.addEventListener('click', (e) => {
                e.preventDefault();
                Modal.showTaskForm();
            });
            if (window.Telegram?.WebApp) {
                addButton.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
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
                    e.stopPropagation();
                    const id = parseInt(e.target.closest('.task-card').dataset.id);
                    if (!checkbox.disabled) {
                        checkbox.checked = !checkbox.checked;
                        this.toggleTask(id);
                    }
                }, { passive: false });
            }
        });

        document.querySelectorAll('.delete-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(e.target.dataset.id);
                this.deleteTask(id);
            });
            if (window.Telegram?.WebApp) {
                icon.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const id = parseInt(e.target.dataset.id);
                    this.deleteTask(id);
                }, { passive: false });
            }
        });

        document.querySelectorAll('.task-card').forEach(card => {
            let touchTimer;
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('task-checkbox') && !e.target.classList.contains('delete-icon')) {
                    const id = parseInt(card.dataset.id);
                    const task = this.activeTasks.find(t => t.id === id) || this.completedTasks.find(t => t.id === id);
                    if (task) Modal.showEditTaskForm(task);
                }
            });
            if (window.Telegram?.WebApp) {
                card.addEventListener('touchstart', (e) => {
                    touchTimer = setTimeout(() => {
                        if (!e.target.classList.contains('task-checkbox') && !e.target.classList.contains('delete-icon')) {
                            e.preventDefault();
                            e.stopPropagation();
                            const id = parseInt(card.dataset.id);
                            const task = this.activeTasks.find(t => t.id === id) || this.completedTasks.find(t => t.id === id);
                            if (task) {
                                console.log('Opening edit modal for task:', task);
                                document.getElementById('debug').textContent = 'Открытие модального окна для редактирования';
                                Modal.showEditTaskForm(task);
                            } else {
                                document.getElementById('debug').textContent = 'Ошибка: Задача не найдена';
                            }
                        }
                    }, 500);
                }, { passive: false });

                card.addEventListener('touchend', (e) => {
                    clearTimeout(touchTimer);
                }, { passive: false });

                card.addEventListener('touchmove', () => {
                    clearTimeout(touchTimer);
                }, { passive: true });
            }
        });
    }

    setupDragAndDrop() {
        const taskList = document.getElementById('task-list');
        const completedContainer = document.getElementById('completed');
        if (!taskList || !completedContainer) {
            console.error('Task list or completed container not found for drag and drop');
            return;
        }

        const handleDragStart = (e) => {
            const taskCard = e.target.closest('.task-card');
            if (taskCard && !window.Telegram?.WebApp) {
                e.dataTransfer.setData('text/plain', taskCard.dataset.id);
                taskCard.classList.add('dragging');
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
            const targetContainer = e.target.closest('.task-list-inner') || e.target.closest('#completed .task-list-inner');
            const isCompleted = targetContainer && targetContainer.closest('#completed');

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

        taskList.querySelector('.task-list-inner').addEventListener('dragstart', handleDragStart);
        taskList.querySelector('.task-list-inner').addEventListener('dragend', handleDragEnd);
        taskList.querySelector('.task-list-inner').addEventListener('dragover', handleDragOver);
        taskList.querySelector('.task-list-inner').addEventListener('drop', handleDrop);

        completedContainer.querySelector('.task-list-inner').addEventListener('dragstart', handleDragStart);
        completedContainer.querySelector('.task-list-inner').addEventListener('dragend', handleDragEnd);
        completedContainer.querySelector('.task-list-inner').addEventListener('dragover', handleDragOver);
        completedContainer.querySelector('.task-list-inner').addEventListener('drop', handleDrop);

        if (window.Telegram?.WebApp) {
            this.setupTouchDragAndDrop();
        }
    }

    setupTouchDragAndDrop() {
        let touchStartX = 0;
        let touchStartY = 0;
        let draggedTask = null;

        const reorderTasks = (draggedTask, targetTask, listType) => {
            const draggedId = parseInt(draggedTask.dataset.id);
            const targetId = parseInt(targetTask.dataset.id);
            const list = listType === 'active' ? this.activeTasks : this.completedTasks;

            const draggedIndex = list.findIndex(task => task.id === draggedId);
            const targetIndex = list.findIndex(task => task.id === targetId);

            if (draggedIndex !== -1 && targetIndex !== -1) {
                const [draggedTaskData] = list.splice(draggedIndex, 1);
                list.splice(targetIndex, 0, draggedTaskData);
                Storage.save(listType === 'active' ? 'tasks' : 'completed', list);
                this.render();
            }
        };

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
                    if (Math.abs(deltaY) > 10 || Math.abs(deltaX) > 10) {
                        draggedTask.style.position = 'absolute';
                        draggedTask.style.left = `${touchX - draggedTask.offsetWidth / 2}px`;
                        draggedTask.style.top = `${touchY - draggedTask.offsetHeight / 2}px`;
                    }
                }
            }, { passive: true });

            card.addEventListener('touchend', (e) => {
                if (draggedTask) {
                    const touchEndX = e.changedTouches[0].clientX;
                    const touchEndY = e.changedTouches[0].clientY;
                    const targetContainer = document.elementFromPoint(touchEndX, touchEndY).closest('.task-list-inner') || document.elementFromPoint(touchEndX, touchEndY).closest('#completed .task-list-inner');
                    const targetTask = document.elementFromPoint(touchEndX, touchEndY).closest('.task-card');
                    const isCompleted = targetContainer && targetContainer.closest('#completed');

                    const id = parseInt(draggedTask.dataset.id);
                    const draggedTaskData = this.activeTasks.find(task => task.id === id) || this.completedTasks.find(task => task.id === id);

                    if (draggedTaskData && targetContainer) {
                        if (isCompleted && this.activeTasks.includes(draggedTaskData)) {
                            draggedTaskData.completed = true;
                            this.completedTasks.push(this.activeTasks.splice(this.activeTasks.indexOf(draggedTaskData), 1)[0]);
                            Storage.save('tasks', this.activeTasks);
                            Storage.save('completed', this.completedTasks);
                            this.render();
                        } else if (!isCompleted && this.completedTasks.includes(draggedTaskData)) {
                            draggedTaskData.completed = false;
                            this.activeTasks.push(this.completedTasks.splice(this.completedTasks.indexOf(draggedTaskData), 1)[0]);
                            Storage.save('tasks', this.activeTasks);
                            Storage.save('completed', this.completedTasks);
                            this.render();
                        } else if (targetTask && targetTask !== draggedTask) {
                            const listType = this.activeTasks.includes(draggedTaskData) ? 'active' : 'completed';
                            reorderTasks(draggedTask, targetTask, listType);
                        }
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