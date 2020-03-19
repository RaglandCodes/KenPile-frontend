// This is meant to talk with the KenPile back end server

const baseURL = 'http://localhost:5000';
async function dataFetch(method, route, headers, body) {
    let queryURL = `${baseURL}/${route}`;

    if (headers) {
        queryURL += '?';
        for (header in headers) {
            queryURL += `${header}=${headers[header]}`;
        }
    }

    console.log(`${queryURL} <= queryURL`);

    return (
        fetch(queryURL, {
            method: method,
            body: `${JSON.stringify(body)}`,
        })
            .then(res => res.json())
            // .then(jsonRes => {
            //     console.log(`${JSON.stringify(jsonRes, null, 2)} <= jsonRes`);
            //     return jsonRes;
            // })
            .catch(err => {
                console.log(`${err} <= error in fetching ${queryURL}`);
            })
    );
}

module.exports = { dataFetch };
