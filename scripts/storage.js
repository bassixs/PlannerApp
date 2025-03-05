class Storage {
    static load(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    static save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
}