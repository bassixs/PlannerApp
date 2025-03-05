class Notifications {
    static schedule(title, dueDate) {
        if (window.Telegram?.WebApp) {
            // Уведомление в Telegram
            window.Telegram.WebApp.showAlert(`Напоминание: ${title} на ${dueDate}`);
            
            // Временное уведомление на странице
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = `Напоминание: ${title} на ${dueDate}`;
            document.body.appendChild(notification);

            // Стили для уведомления (добавьте в style.css)
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateY(0)';
            }, 100);

            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-50px)';
                setTimeout(() => notification.remove(), 500);
            }, 3000);
        } else {
            console.log(`Запланировано: ${title} на ${dueDate}`);
        }
    }
}