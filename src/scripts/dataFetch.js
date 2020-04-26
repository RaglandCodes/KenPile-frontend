// This is meant to talk with the KenPile back end server

//const baseURL = 'http://localhost:5000';
const baseURL = 'https://kenpile.herokuapp.com';

async function dataFetch(method, route, headers, body) {
    let queryURL = `${baseURL}/${route}`;

    if (headers) {
        queryURL += '?';
        for (header in headers) {
            queryURL += `${header}=${headers[header]}`;
        }
    }

    return fetch(queryURL, {
        method: method,
        credentials: 'include',
        body: method === 'POST' ? `${JSON.stringify(body)}` : null,
    })
        .then(res => {
            return res.json();
        })
        .then(jsonRes => {
            return jsonRes;
        })
        .catch(err => {
            console.log(`${err} <= error in fetching ${queryURL}`);
            return 'ERROR';
        });
}

module.exports = { dataFetch };
