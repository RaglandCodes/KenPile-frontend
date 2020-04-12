import { dataFetch } from './dataFetch';

const singInBtn = document.querySelector('#GSingInBtn');
const singOutBtn = document.querySelector('#logoutBtn');

const beforeSignInSection = document.querySelector('#user--beforeSI');
const afterSignInSection = document.querySelector('#user--afterSI');
const homePage = document.querySelector('#body--home');
const landingPage = document.querySelector('#body--landing');
const userNameSpan = document.querySelector('#user--nameSpan');

let userState = {
    signedIn: false,
};

let userInfo = {};
let googleUser = {};

if (localStorage.getItem('signedIn') === 'true') {
    dataFetch('POST', 'logBackIn').then(res => {
        if (res.body === 'Verified') {
            homePage.classList.remove('hidden');
            landingPage.classList.add('hidden');
            userState['signedIn'] = false;
        }
    });
}
// TODO rename this function
function startApp() {
    gapi.load('auth2', function () {
        var auth2 = gapi.auth2.init({
            client_id:
                '906977270322-n4u9v0sua99hiqbjtmsjg7tfji2qihqo.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
        });
        auth2.attachClickHandler(
            singInBtn,
            {},
            googleUser => {
                userInfo = googleUser;
                verifyIdToken(googleUser.tc.id_token);
            },
            error => {
                alert(JSON.stringify(error, undefined, 2));
            }
        );
    });
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
        userState['signedIn'] = false;
        localStorage.setItem('signedIn', 'false');
        //beforeSignInSection.classList.remove('hidden');
        //afterSignInSection.classList.add('hidden');

        //homePage.classList.add('hidden');
        landingPage.classList.remove('hidden');
    });
}

async function verifyIdToken(idToken) {
    let signInRespnse = await dataFetch(
        'POST',
        'verifyIdToken',
        { token: idToken },
        null
    );

    if (signInRespnse === 'ERROR') {
        alert('Somehting went wrong');
    } else if (signInRespnse.status === 'OK') {
        userState['signedIn'] = true;

        //beforeSignInSection.classList.add('hidden');
        //afterSignInSection.classList.remove('hidden');

        homePage.classList.remove('hidden');
        landingPage.classList.add('hidden');
        localStorage.setItem('signedIn', 'true');

        //userNameSpan.innerText = userInfo.Pt.Ad;
    } else {
        console.log(
            `${JSON.stringify(signInRespnse, null, 2)} <= signInRespnse`
        );
    }
}

//TODO do this earlier.
singInBtn.addEventListener('click', () => {
    startApp();
});

singOutBtn.addEventListener('click', () => {
    signOut();
});
// window.WINDOWSTARTAPP = startApp;
export { userState, startApp };
