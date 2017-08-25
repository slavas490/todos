let ajax = {
    post (url, body) {
        return fetch(url, {
            credentials: 'same-origin',
            method: 'POST',
            body: (typeof body === 'object' ? JSON.stringify(body) : null),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(out => out.json())
    },
    get (url) {
        return fetch(url, {
            credentials: 'same-origin',
            method: 'GET'
        })
        .then(out => out.json())
    },
    put (url, body) {
        return fetch(url, {
            credentials: 'same-origin',
            method: 'PUT',
            body: (typeof body === 'object' ? JSON.stringify(body) : null),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(out => out.json())
    },
    delete (url) {
        return fetch(url, {
            credentials: 'same-origin',
            method: 'DELETE'
        })
        .then(out => out.json())
    }
}

export default ajax