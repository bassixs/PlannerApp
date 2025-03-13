document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const createButton = document.querySelector('.create-btn');

    if (!createButton) {
        console.error('Create button not found');
        document.getElementById('debug').textContent = 'Ошибка: Кнопка "Создать" не найдена';
        return;
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;

            // Деактивируем все вкладки и контент
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            // Активируем выбранную вкладку и контент
            tab.classList.add('active');
            const content = document.getElementById(tabId);
            if (content) {
                content.classList.add('active');
                console.log(`Tab clicked: ${tabId}`);
                console.log(`Tab content activated: ${tabId}`);
            } else {
                console.error(`Content for tab ${tabId} not found`);
                document.getElementById('debug').textContent = `Ошибка: Контент для вкладки ${tabId} не найден`;
            }
        });

        // Обработка touch для Telegram Web App
        if (window.Telegram?.WebApp) {
            tab.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const tabId = tab.dataset.tab;

                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));

                tab.classList.add('active');
                const content = document.getElementById(tabId);
                if (content) {
                    content.classList.add('active');
                    console.log(`Tab clicked: ${tabId}`);
                    console.log(`Tab content activated: ${tabId}`);
                } else {
                    console.error(`Content for tab ${tabId} not found`);
                    document.getElementById('debug').textContent = `Ошибка: Контент для вкладки ${tabId} не найден`;
                }
            }, { passive: false });
        }
    });

    // Обработчик для кнопки "Создать"
    createButton.addEventListener('click', () => {
        const activeTab = document.querySelector('.tab.active');
        if (!activeTab) {
            console.error('No active tab found');
            document.getElementById('debug').textContent = 'Ошибка: Активная вкладка не найдена';
            return;
        }

        const tabId = activeTab.dataset.tab;
        console.log(`Create button clicked on tab: ${tabId}`);

        switch (tabId) {
            case 'tasks':
                if (typeof Modal !== 'undefined' && Modal.showTaskForm) {
                    Modal.showTaskForm();
                } else {
                    console.error('Modal.showTaskForm is not defined');
                    document.getElementById('debug').textContent = 'Ошибка: Modal.showTaskForm не определён';
                }
                break;
            case 'habits':
                if (typeof Modal !== 'undefined' && Modal.showHabitForm) {
                    Modal.showHabitForm();
                } else {
                    console.error('Modal.showHabitForm is not defined');
                    document.getElementById('debug').textContent = 'Ошибка: Modal.showHabitForm не определён';
                }
                break;
            case 'goals':
                if (typeof Modal !== 'undefined' && Modal.showGoalForm) {
                    Modal.showGoalForm();
                } else {
                    console.error('Modal.showGoalForm is not defined');
                    document.getElementById('debug').textContent = 'Ошибка: Modal.showGoalForm не определён';
                }
                break;
            case 'calendar':
                if (typeof Modal !== 'undefined' && Modal.showEventForm) {
                    Modal.showEventForm();
                } else {
                    console.error('Modal.showEventForm is not defined');
                    document.getElementById('debug').textContent = 'Ошибка: Modal.showEventForm не определён';
                }
                break;
            default:
                console.error('Unknown tab:', tabId);
                document.getElementById('debug').textContent = `Ошибка: Неизвестная вкладка ${tabId}`;
        }
    });

    // Обработка touch для Telegram Web App
    if (window.Telegram?.WebApp) {
        createButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const activeTab = document.querySelector('.tab.active');
            if (!activeTab) {
                console.error('No active tab found');
                document.getElementById('debug').textContent = 'Ошибка: Активная вкладка не найдена';
                return;
            }

            const tabId = activeTab.dataset.tab;
            console.log(`Create button touched on tab: ${tabId}`);

            switch (tabId) {
                case 'tasks':
                    if (typeof Modal !== 'undefined' && Modal.showTaskForm) {
                        Modal.showTaskForm();
                    } else {
                        console.error('Modal.showTaskForm is not defined');
                        document.getElementById('debug').textContent = 'Ошибка: Modal.showTaskForm не определён';
                    }
                    break;
                case 'habits':
                    if (typeof Modal !== 'undefined' && Modal.showHabitForm) {
                        Modal.showHabitForm();
                    } else {
                        console.error('Modal.showHabitForm is not defined');
                        document.getElementById('debug').textContent = 'Ошибка: Modal.showHabitForm не определён';
                    }
                    break;
                case 'goals':
                    if (typeof Modal !== 'undefined' && Modal.showGoalForm) {
                        Modal.showGoalForm();
                    } else {
                        console.error('Modal.showGoalForm is not defined');
                        document.getElementById('debug').textContent = 'Ошибка: Modal.showGoalForm не определён';
                    }
                    break;
                case 'calendar':
                    if (typeof Modal !== 'undefined' && Modal.showEventForm) {
                        Modal.showEventForm();
                    } else {
                        console.error('Modal.showEventForm is not defined');
                        document.getElementById('debug').textContent = 'Ошибка: Modal.showEventForm не определён';
                    }
                    break;
                default:
                    console.error('Unknown tab:', tabId);
                    document.getElementById('debug').textContent = `Ошибка: Неизвестная вкладка ${tabId}`;
            }
        }, { passive: false });
    }
});