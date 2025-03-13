document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

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
});