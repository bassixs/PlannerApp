class Storage {
    static isStorageAvailable(type) {
        try {
            const storage = window[type];
            const testKey = '__storage_test__';
            storage.setItem(testKey, 'test');
            storage.removeItem(testKey);
            return true;
        } catch (e) {
            console.error(`Storage ${type} is not available:`, e);
            return false;
        }
    }

    static load(key) {
        let data;
        if (this.isStorageAvailable('localStorage')) {
            data = localStorage.getItem(key);
        } else if (this.isStorageAvailable('sessionStorage')) {
            data = sessionStorage.getItem(key);
        } else {
            console.warn('No storage available, returning empty array');
            return [];
        }
        try {
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error parsing storage data for key:', key, e);
            return [];
        }
    }

    static save(key, data) {
        try {
            if (this.isStorageAvailable('localStorage')) {
                localStorage.setItem(key, JSON.stringify(data));
            } else if (this.isStorageAvailable('sessionStorage')) {
                sessionStorage.setItem(key, JSON.stringify(data));
            } else {
                console.error('No storage available for saving');
            }
        } catch (e) {
            console.error('Error saving to storage:', e);
        }
    }
}