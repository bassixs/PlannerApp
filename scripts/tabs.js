document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    if (tabs.length === 0) {
        console.error('No tabs found');
        return;
    }
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            console.log('Tab clicked:', tab.dataset.tab);
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const tabContent = document.getElementById(tab.dataset.tab);
            if (tabContent) {
                // Уберите активный класс у всех вкладок, чтобы сбросить анимацию
                setTimeout(() => {
                    tabContent.classList.add('active');
                    console.log('Tab content activated:', tab.dataset.tab);
                }, 10); // Небольшая задержка для срабатывания анимации
            } else {
                console.error('Tab content not found:', tab.dataset.tab);
            }
        });
        if (window.Telegram?.WebApp) {
            tab.addEventListener('touchstart', () => {
                console.log('Tab touched:', tab.dataset.tab);
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const tabContent = document.getElementById(tab.dataset.tab);
                if (tabContent) {
                    setTimeout(() => {
                        tabContent.classList.add('active');
                        console.log('Tab content activated (touch):', tab.dataset.tab);
                    }, 10);
                } else {
                    console.error('Tab content not found (touch):', tab.dataset.tab);
                }
            });
        }
    });
});