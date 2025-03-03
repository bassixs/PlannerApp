class Notifications {
    static schedule(title, dueDate) {
        // Интеграция с Telegram для уведомлений
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.showAlert(`Scheduled: ${title} for ${dueDate}`);
        }
    }
}