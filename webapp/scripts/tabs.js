document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    if (tabs.length === 0) {
        console.error('No tabs found');
        return;
    }
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            console.log(`Tab ${tab.dataset.tab} clicked`);
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
        if (window.Telegram?.WebApp) {
            tab.addEventListener('touchstart', () => {
                console.log(`Touchstart on tab ${tab.dataset.tab}`);
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
        }
    });
});