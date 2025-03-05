class Modal {
    static showTaskForm() {
        const modal = document.getElementById('modal');
        if (!modal) {
            console.error('Контейнер модального окна не найден');
            return;
        }
        modal.innerHTML = `
            <div class="card modal-card">
                <h3><i class="fas fa-tasks"></i> Новая задача</h3>
                <div class="modal-field">
                    <label><i class="fas fa-info-circle"></i> Описание задачи</label>
                    <textarea id="taskDescription" placeholder="Введите описание"></textarea>
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
                    <input id="taskAssignee" placeholder="Введите имя или выберите">
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
                    <label><i class="fas fa-map-marker-alt"></i> Площадка выполнения</label>
                    <input id="taskLocation" placeholder="Введите площадку">
                </div>
                <div class="modal-field">
                    <label><i class="fas fa-tags"></i> Метки</label>
                    <input id="taskTags" placeholder="+ Добавить метку">
                </div>
                <div class="modal-buttons">
                    <button class="cancel-btn" id="modal-cancel-btn">Отмена</button>
                    <button class="add-btn" id="modal-add-btn">Сохранить</button>
                </div>
            </div>
        `;
        modal.classList.add('active');
        console.log('Модальное окно открыто');

        const addBtn = modal.querySelector('#modal-add-btn');
        const cancelBtn = modal.querySelector('#modal-cancel-btn');

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                console.log('Кнопка "Сохранить" в модальном окне нажата');
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
            if (window.Telegram?.WebApp) {
                addBtn.addEventListener('touchstart', () => {
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
            }
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                console.log('Кнопка "Отмена" нажата');
                Modal.hide();
            });
        }
    }

    static showEditTaskForm(task) {
        const modal = document.getElementById('modal');
        if (!modal) {
            console.error('Контейнер модального окна не найден');
            return;
        }
        modal.innerHTML = `
            <div class="card modal-card">
                <h3><i class="fas fa-tasks"></i> Редактировать задачу</h3>
                <div class="modal-field">
                    <label><i class="fas fa-info-circle"></i> Описание задачи</label>
                    <textarea id="taskDescription" placeholder="Введите описание">${task.description || ''}</textarea>
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
                    <input id="taskAssignee" value="${task.assignee || ''}" placeholder="Введите имя или выберите">
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
                    <label><i class="fas fa-map-marker-alt"></i> Площадка выполнения</label>
                    <input id="taskLocation" value="${task.location || ''}" placeholder="Введите площадку">
                </div>
                <div class="modal-field">
                    <label><i class="fas fa-tags"></i> Метки</label>
                    <input id="taskTags" value="${task.tags.join(', ') || ''}" placeholder="+ Добавить метку">
                </div>
                <div class="modal-buttons">
                    <button class="cancel-btn" id="modal-cancel-btn">Отмена</button>
                    <button class="edit-btn" id="modal-edit-btn">Сохранить</button>
                </div>
            </div>
        `;
        modal.classList.add('active');
        console.log('Модальное окно редактирования открыто');

        const editBtn = modal.querySelector('#modal-edit-btn');
        const cancelBtn = modal.querySelector('#modal-cancel-btn');

        if (editBtn) {
            editBtn.addEventListener('click', () => {
                console.log('Кнопка "Сохранить" в модальном окне редактирования нажата');
                taskManager.editTask(task.id, {
                    description: document.getElementById('taskDescription').value,
                    dueDate: document.getElementById('taskDue').value,
                    priority: document.getElementById('taskPriority').value,
                    taskDescription: document.getElementById('taskDescription').value,  // Описание совпадает с основным
                    status: document.getElementById('taskStatus').value,
                    assignee: document.getElementById('taskAssignee').value,
                    location: document.getElementById('taskLocation').value,
                    tags: document.getElementById('taskTags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
                });
                Modal.hide();
            });
            if (window.Telegram?.WebApp) {
                editBtn.addEventListener('touchstart', () => {
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
            }
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                console.log('Кнопка "Отмена" в модальном окне редактирования нажата');
                Modal.hide();
            });
        }
    }

    static hide() {
        const modal = document.getElementById('modal');
        modal.classList.remove('active');
        console.log('Модальное окно закрыто');
    }
}