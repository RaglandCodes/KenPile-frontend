require('../styles/common.css');
require('./home.css');
import { dataFetch } from '../scripts/dataFetch';

function setNotes(body) {
    console.dir(body);
    console.log('^body');
    const divAllNotes = document.querySelector('#all-notes');

    body.forEach(note => {
        divAllNotes.innerHTML += `
    <div class="note" id="note-${note.ID}"onClick="window.location.assign('/note.html?id=${note.ID}');">
    </div>
    `;

        let editor = new Quill(`#note-${note.ID}`);
        editor.enable(false); // editor is only for viewing
        editor.setContents(JSON.parse(note.Delta.String)['ops']);
    });
}
function initHome() {
    dataFetch('GET', 'fetchAllNotes', null, null)
        .then(res => {
            if (res.status === 'OK') {
                const body = JSON.parse(res.body);
                setNotes(body);
            } else {
                alert("Couldn't fetch your notes");
                //TODO replace alerts with dialog?, etc
            }
        })
        .catch(err => {
            alert("Couldn't fetch your notes");
            console.log(`${err} <== err home fetchAllNotes`);
        });
}

window.onload = () => {
    initHome();
};
