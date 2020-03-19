import { dataFetch } from './dataFetch';

let userState = {
    signedIn: false,
};

async function onSignIn(userProfile) {
    console.dir(userProfile);
    let idToken = userProfile.getAuthResponse().id_token;

    let signInRespnse = await dataFetch(
        'POST',
        'verifyIdToken',
        { token: idToken },
        null
    );

    if (signInRespnse.status === 'OK') {
        userState['signedIn'] = true;
    } else {
        console.log(
            `${JSON.stringify(signInRespnse, null, 2)} <= signInRespnse`
        );
    }
    console.log(`${JSON.stringify(userState, null, 2)} <= userState`);
}

//TODO give a different name
window.onSignIn = onSignIn;

export { userState };
