class Storage {
    static load(key) {
        try {
            // Проверяем версию данных
            const currentVersion = "1.1"; // Установим новую версию данных
            const storedVersion = localStorage.getItem('appVersion');

            if (storedVersion !== currentVersion) {
                // Если версия устарела, очищаем все данные
                localStorage.clear();
                localStorage.setItem('appVersion', currentVersion);
                console.log('Данные приложения очищены из-за изменения версии');
                return null;
            }

            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Ошибка загрузки данных из localStorage:', e);
            return null;
        }
    }

    static save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Ошибка сохранения данных в localStorage:', e);
        }
    }
}