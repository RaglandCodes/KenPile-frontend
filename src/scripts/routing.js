// Takes care of page changes and hiding and showing the necessary elements/when route changes
// -----  imports -----
import { userState } from './auth';

console.log(`${JSON.stringify(userState, null, 2)} <== userState`);

// -----  constants / globals -----
const userBtn = document.querySelector('#nav--userBtn');
const homeBtn = document.querySelector('#nav--notesBtn');

const userPage = document.querySelector('#body--user');
const landingPage = document.querySelector('#body--landing');
const homePage = document.querySelector('#body--home');

// -----  functions  -----
function hideAllPages() {
    const pages = document.querySelectorAll('.body--page');
    pages.forEach(page => {
        page.classList.add('hidden');
    });
}

// -----  event listeners  -----
// userBtn.addEventListener('click', () => {
//     console.log(`${JSON.stringify(userState, null, 2)} <== userState`);
//     history.pushState({}, 'User | KenPile', '/user');
//     hideAllPages();
//     userPage.classList.remove('hidden');
// });

// homeBtn.addEventListener('click', () => {
//     history.pushState({}, 'KenPile', '/');
//     hideAllPages();

//     if (userState.signedIn) {
//         homePage.classList.remove('hidden');
//     } else {
//         landingPage.classList.remove('hidden');
//     }
// });
