import { dataFetch } from './dataFetch';
const nanoid = require('nanoid');

const newNoteBtn = document.querySelector('#home--newNote');

function createNewNote() {
    const newToken = nanoid(7);
    console.log(`${newToken} <== newToken`);
    dataFetch('POST', 'createNewNote', { id: newToken }, null);
}

newNoteBtn.addEventListener('click', createNewNote);
