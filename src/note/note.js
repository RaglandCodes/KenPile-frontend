/*  --- Flow ---
- Get note ID from url, if ID is 'new', create one using nanoid

- Save ID in LS

- If new note
    - Send that ID to S to make a new note
- Else
    - Read the contents of the note with ID from LS from DB. 
    - If S (server) returns OK, show the note contents

- saveEveryNChanges

*/

// --- imports ---
require('../styles/common.css');
require('./note.css');
import { dataFetch } from '../scripts/dataFetch';
const nanoid = require('nanoid');

// --- DOM ---
// put inside window.onload ?? TODO
const dbSaveStatusSpan = document.querySelector('#save-status');
const saveBtn = document.querySelector('#save');
// --- ^_^ ---
const saveEveryNChanges = 15;
let editsSinceSave = -1; // text-change event is fired when setting text. So = 0 after setting text
let editor;
let dbSaveStatus = 'none'; // none || waiting || error

function setDbSaveStatus(status) {
    //(Dis/en)able the button
    if (status === 'waiting') {
        saveBtn.disabled = true;
    } else {
        saveBtn.disabled = false;
    }

    //show appropirate message
    if (dbSaveStatus === 'waiting' && status === 'none') {
        dbSaveStatusSpan.textContent = 'Changes saved';
    }

    if (status === 'typing') {
        if (editsSinceSave > 1 && dbSaveStatus === 'none') {
            dbSaveStatusSpan.textContent = 'You have unsaved work';
        }
        return;
    }

    dbSaveStatus = status;
    if (status === 'waiting') {
        dbSaveStatusSpan.textContent = 'Saving changes...';
        return;
    }

    if (status === 'error') {
        dbSaveStatusSpan.textContent = 'Error in saving.';
        return;
    }
}

function updateNote() {
    if (editsSinceSave === -1) {
        dbSaveStatusSpan.textContent = 'Already saved';
        return;
    }

    setDbSaveStatus('waiting');
    let changesGettingSaved = editsSinceSave;
    dataFetch('POST', 'updateNote', null, {
        id: localStorage.getItem('noteId'),
        delta: JSON.stringify(editor.getContents()),
        text: editor.getText(),
    })
        .then(res => {
            if (res.status === 'OK') {
                if (editsSinceSave === 0 && changesGettingSaved === 0) {
                    // allow only one redundant update
                    editsSinceSave = -1;
                } else if (editsSinceSave > 0) {
                    editsSinceSave = editsSinceSave - changesGettingSaved;
                }

                setDbSaveStatus('none');
            }
        })
        .catch(err => {
            setDbSaveStatus('error');
            console.log(`${err} <== POST updateNote err`);
        });
}
function handleTextChange() {
    editsSinceSave += 1;
    setDbSaveStatus('typing');
    if (editsSinceSave > saveEveryNChanges && dbSaveStatus !== 'waiting') {
        updateNote();
    }
}

function initialiseEditor() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const noteId = urlParams.get('id');

    localStorage.setItem('noteId', noteId); // If value is 'new' it, could cause problem, but its fine as editor won't be enabled.

    editor = new Quill('#editor', {
        modules: { toolbar: '#toolbar' },
        placeholder: 'Type here...',
    });

    editor.enable(false); // allow editing only when OK with S
    editor.on('text-change', handleTextChange);

    if (noteId === 'new') {
        // create new note
        const newNoteId = nanoid(7); // Like 007

        dataFetch('POST', 'createNewNote', { id: newNoteId }, null)
            .then(res => {
                console.dir(res);
                console.log('^res');
                if (res.status === 'OK') {
                    history.replaceState({}, '', `/note.html?id=${newNoteId}`);
                    localStorage.setItem('noteId', newNoteId);

                    // enable only after creating new note
                    editor.enable(true);
                    editor.focus();
                    saveBtn.disabled = false;
                }
            })
            .catch(createNewNoteErr => {
                console.log(`${createNewNoteErr} <== createNewNoteErr`);
            });
    } else {
        // note exists

        // fetch note from db
        dataFetch('GET', 'fetchNote', { id: noteId }, null).then(res => {
            if (res.status === 'OK') {
                // set editor text with fetched content
                editor.setContents(JSON.parse(res.body)['ops']);

                // enable only after fetching old note
                editor.enable(true);
                editor.focus();
                saveBtn.disabled = false;
            } else {
                alert("Couldn't get your note. Very sorry");

                // TODO give user option to fetch again or create a new one
            }
        });
    }
}

window.onload = () => {
    initialiseEditor();

    saveBtn.addEventListener('click', updateNote);
    saveBtn.disabled = true;
};

window.addEventListener('beforeunload', event => {
    if (editsSinceSave > 0) {
        event.preventDefault();
        event.returnValue = '';

        updateNote();
    }
});
