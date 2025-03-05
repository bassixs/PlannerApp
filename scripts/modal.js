class Modal {
    static showTaskForm() {
        const modal = document.getElementById('modal');
        if (!modal) return;
        modal.innerHTML = `
            <div class="card modal-card">
                <h3><i class="fas fa-tasks"></i> Новая задача</h3>
                <div class="modal-field">
                    <label><i class="fas fa-info-circle"></i> Описание</label>
                    <input id="taskDescription" placeholder="Введите описание">
                </div>
                <div class="modal-field">
                    <label><i class="fas fa-calendar-alt"></i> Дата</label>
                    <input id="taskDue" type="date">
                </div>
                <div class="modal-field">
                    <label><i class="fas fa-flag"></i> Приоритет</label>
                    <select id="taskPriority">
                        <option value="low">Низкий</option>
                        <option value="medium" selected>Средний</option>
                        <option value="high">Высокий</option>
                    </select>
                </div>
                <div class="modal-field">
                    <label><i class="fas fa-circle"></i> Статус</label>
                    <select id="taskStatus">
                        <option value="in-progress" selected>В работе</option>
                        <option value="completed">Завершено</option>
                        <option value="paused">На паузе</option>
                    </select>
                </div>
                <div class="modal-field">
                    <label><i class="fas fa-user"></i> Исполнитель</label>
                    <input id="taskAssignee" placeholder="Введите имя">
                </div>
                <div class="modal-field">
                    <label><i class="fas fa-map-marker-alt"></i> Площадка</label>
                    <input id="taskLocation" placeholder="Введите площадку">
                </div>
                <div class="modal-field">
                    <label><i class="fas fa-tags"></i> Метки</label>
                    <input id="taskTags" placeholder="Метки через запятую">
                </div>
                <div class="modal-buttons">
                    <button class="cancel-btn" id="modal-cancel-btn">Отмена</button>
                    <button class="add-btn" id="modal-add-btn">Сохранить</button>
                </div>
            </div>
        `;
        modal.classList.add('active');

        modal.querySelector('#modal-add-btn').addEventListener('click', () => {
            taskManager.addTask(
                document.getElementById('taskDescription').value,
                document.getElementById('taskDue').value,
                document.getElementById('taskPriority').value,
                document.getElementById('taskDescription').value,
                document.getElementById('taskStatus').value,
                document.getElementById('taskAssignee').value,
                document.getElementById('taskLocation').value,
                document.getElementById('taskTags').value
            );
            Modal.hide();
        });
        modal.querySelector('#modal-cancel-btn').addEventListener('click', () => Modal.hide());
    }

    static showEditTaskForm(task) {
        const modal = document.getElementById('modal');
        if (!modal) return;
        modal.innerHTML = `
            <div class="card modal-card">
                <h3><i class="fas fa-tasks"></i> Редактировать задачу</h3>
                <div class="modal-field">
                    <label><i class="fas fa-info-circle"></i> Описание</label>
                    <input id="taskDescription" value="${task.description || ''}" placeholder="Введите описание">
                </div>
                <div class="modal-field">
                    <label><i class="fas fa-calendar-alt"></i> Дата</label>
                    <input id="taskDue" type="date" value="${task.dueDate || ''}">
                </div>
                <div class="modal-field">
                    <label><i class="fas fa-flag"></i> Приоритет</label>
                    <select id="taskPriority">
                        <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Низкий</option>
                        <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Средний</option>
                        <option value="high" ${task.priority === 'high' ? 'selected' : ''}>Высокий</option>
                    </select>
                </div>
                <div class="modal-field">
                    <label><i class="fas fa-circle"></i> Статус</label>
                    <select id="taskStatus">
                        <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>В работе</option>
                        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Завершено</option>
                        <option value="paused" ${task.status === 'paused' ? 'selected' : ''}>На паузе</option>
                    </select>
                </div>
                <div class="modal-field">
                    <label><i class="fas fa-user"></i> Исполнитель</label>
                    <input id="taskAssignee" value="${task.assignee || ''}" placeholder="Введите имя">
                </div>
                <div class="modal-field">
                    <label><i class="fas fa-map-marker-alt"></i> Площадка</label>
                    <input id="taskLocation" value="${task.location || ''}" placeholder="Введите площадку">
                </div>
                <div class="modal-field">
                    <label><i class="fas fa-tags"></i> Метки</label>
                    <input id="taskTags" value="${task.tags.join(', ') || ''}" placeholder="Метки через запятую">
                </div>
                <div class="modal-buttons">
                    <button class="cancel-btn" id="modal-cancel-btn">Отмена</button>
                    <button class="edit-btn" id="modal-edit-btn">Сохранить</button>
                </div>
            </div>
        `;
        modal.classList.add('active');

        modal.querySelector('#modal-edit-btn').addEventListener('click', () => {
            taskManager.editTask(task.id, {
                description: document.getElementById('taskDescription').value,
                dueDate: document.getElementById('taskDue').value,
                priority: document.getElementById('taskPriority').value,
                taskDescription: document.getElementById('taskDescription').value,
                status: document.getElementById('taskStatus').value,
                assignee: document.getElementById('taskAssignee').value,
                location: document.getElementById('taskLocation').value,
                tags: document.getElementById('taskTags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
            });
            Modal.hide();
        });
        modal.querySelector('#modal-cancel-btn').addEventListener('click', () => Modal.hide());
    }

    static showHabitForm() {
        const modal = document.getElementById('modal');
        if (!modal) return;
        modal.innerHTML = `
            <div class="card modal-card">
                <h3><i class="fas fa-recycle"></i> Новая привычка</h3>
                <div class="modal-field">
                    <label><i class="fas fa-info-circle"></i> Название</label>
                    <input id="habitTitle" placeholder="Введите название">
                </div>
                <div class="modal-field">
                    <label><i class="fas fa-clock"></i> Частота</label>
                    <input id="habitFrequency" placeholder="Например, ежедневно">
                </div>
                <div class="modal-buttons">
                    <button class="cancel-btn" id="modal-cancel-btn">Отмена</button>
                    <button class="add-btn" id="modal-add-btn">Сохранить</button>
                </div>
            </div>
        `;
        modal.classList.add('active');

        modal.querySelector('#modal-add-btn').addEventListener('click', () => {
            habitManager.addHabit(
                document.getElementById('habitTitle').value,
                document.getElementById('habitFrequency').value
            );
            Modal.hide();
        });
        modal.querySelector('#modal-cancel-btn').addEventListener('click', () => Modal.hide());
    }

    static showGoalForm() {
        const modal = document.getElementById('modal');
        if (!modal) return;
        modal.innerHTML = `
            <div class="card modal-card">
                <h3><i class="fas fa-bullseye"></i> Новая цель</h3>
                <div class="modal-field">
                    <label><i class="fas fa-info-circle"></i> Название</label>
                    <input id="goalTitle" placeholder="Введите название">
                </div>
                <div class="modal-field">
                    <label><i class="fas fa-calendar-alt"></i> Срок</label>
                    <input id="goalDeadline" type="date">
                </div>
                <div class="modal-buttons">
                    <button class="cancel-btn" id="modal-cancel-btn">Отмена</button>
                    <button class="add-btn" id="modal-add-btn">Сохранить</button>
                </div>
            </div>
        `;
        modal.classList.add('active');

        modal.querySelector('#modal-add-btn').addEventListener('click', () => {
            goalManager.addGoal(
                document.getElementById('goalTitle').value,
                document.getElementById('goalDeadline').value
            );
            Modal.hide();
        });
        modal.querySelector('#modal-cancel-btn').addEventListener('click', () => Modal.hide());
    }

    static hide() {
        const modal = document.getElementById('modal');
        modal.classList.remove('active');
    }
}