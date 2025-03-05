class Storage {
    static load(key) {
        const data = localStorage.getItem(key) || sessionStorage.getItem(key);
        try {
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error parsing storage data for key:', key, e);
            return [];
        }
    }

    static save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to localStorage, trying sessionStorage:', e);
            try {
                sessionStorage.setItem(key, JSON.stringify(data));
            } catch (e) {
                console.error('Error saving to sessionStorage:', e);
            }
        }
    }
}