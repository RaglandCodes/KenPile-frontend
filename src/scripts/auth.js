import { dataFetch } from './dataFetch';

const singInBtn = document.querySelector('#GSingInBtn');
let userState = {
    signedIn: false,
};

var googleUser = {};
function startApp() {
    gapi.load('auth2', function() {
        var auth2 = gapi.auth2.init({
            client_id:
                '906977270322-n4u9v0sua99hiqbjtmsjg7tfji2qihqo.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
        });
        auth2.attachClickHandler(
            singInBtn,
            {},
            googleUser => {
                verifyIdToken(googleUser.uc.id_token);
            },
            error => {
                alert(JSON.stringify(error, undefined, 2));
            }
        );
    });
}

async function verifyIdToken(idToken) {
    let signInRespnse = await dataFetch(
        'POST',
        'verifyIdToken',
        { token: idToken },
        null
    );
    if (signInRespnse.status === 'OK') {
        userState['signedIn'] = true;
        console.log('Verified');
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
// window.WINDOWSTARTAPP = startApp;
export { userState, startApp };
