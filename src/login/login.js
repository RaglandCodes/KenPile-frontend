/*
** Auth Flow ** 

- window loads and calls func loadGApi()

- User clicks on #GSingInBtn and signs in generating an idToken

- That ^ idToken is verified in the back end in func verifyIdToken()

- If that's succussfull, save info to local storage and redirect

- Respond to errors with an alert (TODO improve this)
*/

import('../styles/common.css');
import('./login.css');
import { dataFetch } from '../scripts/dataFetch';
const singInBtn = document.querySelector('#GSingInBtn');

async function verifyIdToken(idToken) {
    let signInRespnse = await dataFetch(
        'POST',
        'verifyIdToken',
        { token: idToken },
        null
    );
    if (signInRespnse.status === 'ERROR') {
        return false;
    } else if (signInRespnse.status === 'OK') {
        return true;
    } else {
        console.log(`${signInRespnse} <== unexpected signInRespnse`);
        return false;
    }
}

function loadGApi() {
    gapi.load('auth2', function () {
        var auth2 = gapi.auth2.init({
            client_id:
                '906977270322-kl09b68qthqgo58en3s099mjbgpfp1vm.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
        });
        auth2.attachClickHandler(
            singInBtn,
            {},
            googleUser => {
                let basicProfile = auth2.currentUser.get().getBasicProfile();
                verifyIdToken(googleUser.getAuthResponse().id_token).then(
                    res => {
                        if (res) {
                            localStorage.setItem('signedIn', 'true');
                            window.location.replace('/home');
                        } else {
                            alert("Couldn't sign in.");
                        }
                    }
                );
            },
            error => {
                console.log(`${JSON.stringify(error, null, 2)} <== error`);
                alert("Couldn't sign in.");
            }
        );
    });
}

window.onload = () => {
    //TODO check if already signed in
    loadGApi();
};
