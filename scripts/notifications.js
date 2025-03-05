class Notifications {
    static schedule(title, dueDate) {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.showAlert(`Запланировано: ${title} на ${dueDate}`);
        }
    }
}