class Modal {
    static showTaskForm() {
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
                        <label><i class="fas fa-calendar-alt"></i> Срок</label>
                        <input type="datetime-local" name="dueDate">
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
                        <label><i class="fas fa-map-marker-alt"></i> Площадка</label>
                        <input type="text" name="location">
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-tags"></i> Метки (через запятую)</label>
                        <input type="text" name="tags">
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
                formData.get('priority'),
                formData.get('taskDescription'),
                formData.get('status'),
                formData.get('assignee'),
                formData.get('location'),
                formData.get('tags')
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
                    formData.get('priority'),
                    formData.get('taskDescription'),
                    formData.get('status'),
                    formData.get('assignee'),
                    formData.get('location'),
                    formData.get('tags')
                );
                modal.classList.remove('active');
            }, { passive: false });
        }
    }

    static showEditTaskForm(task) {
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
                        <label><i class="fas fa-calendar-alt"></i> Срок</label>
                        <input type="datetime-local" name="dueDate" value="${task.dueDate || ''}">
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
                        <label><i class="fas fa-map-marker-alt"></i> Площадка</label>
                        <input type="text" name="location" value="${task.location || ''}">
                    </div>
                    <div class="modal-field">
                        <label><i class="fas fa-tags"></i> Метки (через запятую)</label>
                        <input type="text" name="tags" value="${task.tags.join(', ') || ''}">
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
                priority: formData.get('priority'),
                taskDescription: formData.get('taskDescription'),
                status: formData.get('status'),
                assignee: formData.get('assignee'),
                location: formData.get('location'),
                tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag)
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
                    priority: formData.get('priority'),
                    taskDescription: formData.get('taskDescription'),
                    status: formData.get('status'),
                    assignee: formData.get('assignee'),
                    location: formData.get('location'),
                    tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag)
                });
                modal.classList.remove('active');
            }, { passive: false });
        }
    }
}