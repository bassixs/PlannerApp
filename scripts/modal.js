console.log('modal.js loaded');

class Modal {
    static showTaskForm() {
        console.log('showTaskForm called');
        const modal = document.getElementById('modal');
        if (!modal) {
            console.error('Modal container not found');
            document.getElementById('debug').textContent = 'Ошибка: Modal container not found';
            return;
        }

        modal.innerHTML = `
            <div class="modal-card">
                <h3><i class="fas fa-plus"></i> Новая задача</h3>
                <form id="taskForm">
                    <div class="modal-field">
                        <label><i class="fas fa-heading"></i> Название</label>
                        <input type="text" name="description" required>
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-calendar-alt"></i> Срок (дата)</label>
                        <input type="date" name="dueDate">
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-clock"></i> Время</label>
                        <input type="time" name="dueTime">
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-exclamation-circle"></i> Приоритет</label>
                        <select name="priority">
                            <option value="low">Низкий</option>
                            <option value="medium">Средний</option>
                            <option value="high">Высокий</option>
                        </select>
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-align-left"></i> Описание</label>
                        <textarea name="taskDescription"></textarea>
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-info-circle"></i> Статус</label>
                        <select name="status">
                            <option value="in-progress">В работе</option>
                            <option value="paused">На паузе</option>
                        </select>
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-user"></i> Исполнитель</label>
                        <input type="text" name="assignee">
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-repeat"></i> Периодичность</label>
                        <select name="recurrence">
                            <option value="none">Однократно</option>
                            <option value="daily">Ежедневно</option>
                            <option value="weekly">Еженедельно</option>
                            <option value="monthly">Ежемесячно</option>
                        </select>
                    </div>
                    <div class="modal-buttons">
                        <button type="submit" class="add-btn">Добавить</button>
                        <button type="button" class="cancel-btn">Отмена</button>
                    </div>
                </form>
            </div>
        `;
        modal.classList.add('active');

        const form = modal.querySelector('#taskForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            taskManager.addTask(
                formData.get('description'),
                formData.get('dueDate'),
                formData.get('dueTime'),
                formData.get('priority'),
                formData.get('taskDescription'),
                formData.get('status'),
                formData.get('assignee'),
                formData.get('recurrence')
            );
            modal.classList.remove('active');
        });

        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        if (window.Telegram?.WebApp) {
            modal.querySelector('.cancel-btn').addEventListener('touchend', (e) => {
                e.preventDefault();
                modal.classList.remove('active');
            }, { passive: false });

            modal.querySelector('.add-btn').addEventListener('touchend', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                taskManager.addTask(
                    formData.get('description'),
                    formData.get('dueDate'),
                    formData.get('dueTime'),
                    formData.get('priority'),
                    formData.get('taskDescription'),
                    formData.get('status'),
                    formData.get('assignee'),
                    formData.get('recurrence')
                );
                modal.classList.remove('active');
            }, { passive: false });
        }
    }

    static showEditTaskForm(task) {
        console.log('showEditTaskForm called with task:', task);
        const modal = document.getElementById('modal');
        if (!modal) {
            console.error('Modal container not found');
            document.getElementById('debug').textContent = 'Ошибка: Modal container not found';
            return;
        }

        modal.innerHTML = `
            <div class="modal-card">
                <h3><i class="fas fa-edit"></i> Редактировать задачу</h3>
                <form id="editTaskForm">
                    <div class="modal-field">
                        <label><i class="fas fa-heading"></i> Название</label>
                        <input type="text" name="description" value="${task.description}" required>
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-calendar-alt"></i> Срок (дата)</label>
                        <input type="date" name="dueDate" value="${task.dueDate || ''}">
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-clock"></i> Время</label>
                        <input type="time" name="dueTime" value="${task.dueTime || ''}">
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-exclamation-circle"></i> Приоритет</label>
                        <select name="priority">
                            <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Низкий</option>
                            <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Средний</option>
                            <option value="high" ${task.priority === 'high' ? 'selected' : ''}>Высокий</option>
                        </select>
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-align-left"></i> Описание</label>
                        <textarea name="taskDescription">${task.taskDescription || ''}</textarea>
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-info-circle"></i> Статус</label>
                        <select name="status">
                            <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>В работе</option>
                            <option value="paused" ${task.status === 'paused' ? 'selected' : ''}>На паузе</option>
                        </select>
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-user"></i> Исполнитель</label>
                        <input type="text" name="assignee" value="${task.assignee || ''}">
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-repeat"></i> Периодичность</label>
                        <select name="recurrence">
                            <option value="none" ${task.recurrence === 'none' ? 'selected' : ''}>Однократно</option>
                            <option value="daily" ${task.recurrence === 'daily' ? 'selected' : ''}>Ежедневно</option>
                            <option value="weekly" ${task.recurrence === 'weekly' ? 'selected' : ''}>Еженедельно</option>
                            <option value="monthly" ${task.recurrence === 'monthly' ? 'selected' : ''}>Ежемесячно</option>
                        </select>
                    </div>
                    <div class="modal-buttons">
                        <button type="submit" class="edit-btn">Сохранить</button>
                        <button type="button" class="cancel-btn">Отмена</button>
                    </div>
                </form>
            </div>
        `;
        modal.classList.add('active');

        const form = modal.querySelector('#editTaskForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            taskManager.editTask(task.id, {
                description: formData.get('description'),
                dueDate: formData.get('dueDate'),
                dueTime: formData.get('dueTime'),
                priority: formData.get('priority'),
                taskDescription: formData.get('taskDescription'),
                status: formData.get('status'),
                assignee: formData.get('assignee'),
                recurrence: formData.get('recurrence')
            });
            modal.classList.remove('active');
        });

        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        if (window.Telegram?.WebApp) {
            modal.querySelector('.cancel-btn').addEventListener('touchend', (e) => {
                e.preventDefault();
                modal.classList.remove('active');
            }, { passive: false });

            modal.querySelector('.edit-btn').addEventListener('touchend', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                taskManager.editTask(task.id, {
                    description: formData.get('description'),
                    dueDate: formData.get('dueDate'),
                    dueTime: formData.get('dueTime'),
                    priority: formData.get('priority'),
                    taskDescription: formData.get('taskDescription'),
                    status: formData.get('status'),
                    assignee: formData.get('assignee'),
                    recurrence: formData.get('recurrence')
                });
                modal.classList.remove('active');
            }, { passive: false });
        }
    }

    static showHabitForm() {
        console.log('showHabitForm called');
        const modal = document.getElementById('modal');
        if (!modal) {
            console.error('Modal container not found');
            document.getElementById('debug').textContent = 'Ошибка: Modal container not found';
            return;
        }

        modal.innerHTML = `
            <div class="modal-card">
                <h3><i class="fas fa-leaf"></i> Новая привычка</h3>
                <form id="habitForm">
                    <div class="modal-field">
                        <label><i class="fas fa-heading"></i> Название</label>
                        <input type="text" name="title" required>
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-repeat"></i> Частота (дней)</label>
                        <input type="number" name="frequency" min="1" required>
                    </div>
                    <div class="modal-buttons">
                        <button type="submit" class="add-btn">Добавить</button>
                        <button type="button" class="cancel-btn">Отмена</button>
                    </div>
                </form>
            </div>
        `;
        modal.classList.add('active');

        const form = modal.querySelector('#habitForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            habitManager.addHabit(
                formData.get('title'),
                parseInt(formData.get('frequency'))
            );
            modal.classList.remove('active');
        });

        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        if (window.Telegram?.WebApp) {
            modal.querySelector('.cancel-btn').addEventListener('touchend', (e) => {
                e.preventDefault();
                modal.classList.remove('active');
            }, { passive: false });

            modal.querySelector('.add-btn').addEventListener('touchend', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                habitManager.addHabit(
                    formData.get('title'),
                    parseInt(formData.get('frequency'))
                );
                modal.classList.remove('active');
            }, { passive: false });
        }
    }

    static showGoalForm() {
        console.log('showGoalForm called');
        const modal = document.getElementById('modal');
        if (!modal) {
            console.error('Modal container not found');
            document.getElementById('debug').textContent = 'Ошибка: Modal container not found';
            return;
        }

        modal.innerHTML = `
            <div class="modal-card">
                <h3><i class="fas fa-bullseye"></i> Новая цель</h3>
                <form id="goalForm">
                    <div class="modal-field">
                        <label><i class="fas fa-heading"></i> Название</label>
                        <input type="text" name="title" required>
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-calendar-alt"></i> Срок</label>
                        <input type="date" name="dueDate">
                    </div>
                    <div class="modal-buttons">
                        <button type="submit" class="add-btn">Добавить</button>
                        <button type="button" class="cancel-btn">Отмена</button>
                    </div>
                </form>
            </div>
        `;
        modal.classList.add('active');

        const form = modal.querySelector('#goalForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            goalManager.addGoal(
                formData.get('title'),
                formData.get('dueDate')
            );
            modal.classList.remove('active');
        });

        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        if (window.Telegram?.WebApp) {
            modal.querySelector('.cancel-btn').addEventListener('touchend', (e) => {
                e.preventDefault();
                modal.classList.remove('active');
            }, { passive: false });

            modal.querySelector('.add-btn').addEventListener('touchend', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                goalManager.addGoal(
                    formData.get('title'),
                    formData.get('dueDate')
                );
                modal.classList.remove('active');
            }, { passive: false });
        }
    }

    static showEventForm() {
        console.log('showEventForm called');
        const modal = document.getElementById('modal');
        if (!modal) {
            console.error('Modal container not found');
            document.getElementById('debug').textContent = 'Ошибка: Modal container not found';
            return;
        }

        modal.innerHTML = `
            <div class="modal-card">
                <h3><i class="fas fa-calendar-alt"></i> Новое событие</h3>
                <form id="eventForm">
                    <div class="modal-field">
                        <label><i class="fas fa-heading"></i> Название</label>
                        <input type="text" name="title" required>
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-calendar-alt"></i> Дата и время</label>
                        <input type="datetime-local" name="date" required>
                    </div>
                    <div class="modal-buttons">
                        <button type="submit" class="add-btn">Добавить</button>
                        <button type="button" class="cancel-btn">Отмена</button>
                    </div>
                </form>
            </div>
        `;
        modal.classList.add('active');

        const form = modal.querySelector('#eventForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            calendarManager.addEvent(
                formData.get('title'),
                formData.get('date')
            );
            modal.classList.remove('active');
        });

        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        if (window.Telegram?.WebApp) {
            modal.querySelector('.cancel-btn').addEventListener('touchend', (e) => {
                e.preventDefault();
                modal.classList.remove('active');
            }, { passive: false });

            modal.querySelector('.add-btn').addEventListener('touchend', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                calendarManager.addEvent(
                    formData.get('title'),
                    formData.get('date')
                );
                modal.classList.remove('active');
            }, { passive: false });
        }
    }
}