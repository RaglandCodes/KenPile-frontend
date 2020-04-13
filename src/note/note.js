/*
** Flow **
- Get note ID from localStorage, if no ID, create one using nanoid lib

- Try to read the contents of the note with that ^ ID from DB. 

- If S (server) returns OK, show the note contents

- BOMB Else if server returns status = Error with body = new note created, initialise an empty editor
*/

// --- imports ---
require('../styles/common.css');
require('./note.css');
import { dataFetch } from '../scripts/dataFetch';
const nanoid = require('nanoid');

// --- DOM ---
// put inside window.onload ?? TODO
const dbSaveStatusSpan = document.querySelector('#dbSaveStatus');

// --- ^_^ ---
const saveEveryNChanges = 15;
let editsSinceSave = 0;
let editor;
let dbSaveStatus = 'none'; // none || waiting || error

function setDbSaveStatus(status) {
    dbSaveStatus = status;
    if (status === 'waiting') {
        dbSaveStatusSpan.textContent = 'Saving changes';
        return;
    }

    if (status === 'error') {
        dbSaveStatusSpan.textContent = 'Error in saving changes';
        return;
    }

    dbSaveStatusSpan.textContent = '';
}
function handleTextChange() {
    editsSinceSave += 1;
    if (editsSinceSave > saveEveryNChanges && dbSaveStatus !== 'waiting') {
        setDbSaveStatus('waiting');

        console.log(`${editor.getText()} <== editor.getText()`);
        dataFetch('POST', 'updateNote', null, {
            id: localStorage.getItem('noteId'),
            text: JSON.stringify(editor.getContents()),
        })
            .then(res => {
                if (res.status === 'OK') {
                    editsSinceSave = 0; // Not good
                    setDbSaveStatus('none');
                }
            })
            .catch(err => {
                setDbSaveStatus('error');
                console.log(`${err} <== POST updateNote err`);
            });
    }
}

function initialiseEditor() {
    const noteId = localStorage.getItem('noteId');
    console.log(`${noteId} <== noteId`);

    editor = new Quill('#editor', {
        modules: { toolbar: '#toolbar' },
        placeholder: 'Type here...',
    });

    editor.enable(false); // allow editing only when OK with S
    editor.on('text-change', handleTextChange);
    if (!noteId) {
        // create new note
        const newNoteId = nanoid(7); // Like 007
        dataFetch('POST', 'createNewNote', { id: newNoteId }, null)
            .then(res => {
                console.dir(res);
                console.log('^res');
                if (res.status === 'OK') {
                    localStorage.setItem('noteId', newNoteId);
                    editor.enable(true);
                }
            })
            .catch(createNewNoteErr => {
                console.log(`${createNewNoteErr} <== createNewNoteErr`);
            });
    } else {
        // note exists

        editor.enable(); // BOMB enable only after fetching old note
        // fetch note from db
    }
}

window.onload = () => {
    initialiseEditor();
};
