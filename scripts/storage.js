class Storage {
    static load(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    static save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
}