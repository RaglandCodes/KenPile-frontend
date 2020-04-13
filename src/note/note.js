/*
** Flow **
- Get note ID from localStorage, if no ID, create one using nanoid lib

- Try to read the contents of the note with that ^ ID from DB. 

- If S (server) returns OK, show the note contents

- Else if server returns status = Error with body = new note created, initialise an empty editor
*/

// --- imports ---
require('../styles/common.css');
require('./note.css');
const nanoid = require('nanoid');

function initialiseEditor() {
    let editor = new Quill('#editor', {
        modules: { toolbar: '#toolbar' },
        placeholder: 'Type here...',
    });
}

window.onload = () => {
    initialiseEditor();
};
