window.addEventListener("load", init);

let loginButton;

function init() {
    let user = getCookie("token");

    console.table([['user', user]]);

    if (user) {
        setTimeout(() => console.log("User logged in - redirecting"), 0);
        document.location.href = '/';

    } else {
        loginButton = document.getElementById('loginBtn');
        loginButton.addEventListener('click', loginAction);
        document.querySelector('#forgotPassword').addEventListener('click', forgotPassAction);
        document.querySelector('#signUp').addEventListener('click', signUpAction);
        document.querySelector('#googleLoginBtn').addEventListener('click', loginGoogleAction);
    }



}

function forgotPassAction() {
    console.log("Forgot password press")
}

function signUpAction() {
    console.log("Sign up press")
}

async function loginAction() {
    console.log("Login press")

    loginButton.disabled = true;

    // let loginUrl = 'http://localhost:8080/api/auth/login'
    let loginUrl = 'https://limitless-cove-65021.herokuapp.com/api/auth/login';
    let email = document.querySelector("#login").value
    let password = document.querySelector("#password").value


    var headers = new Headers();
    headers.append('Content-Type', 'text/plain');
    headers.append('Accept', 'application/json, text/plain, */*');
    headers.append('email', email);
    headers.append('password', password)


    let requestOptions = {
        method: 'POST',
        headers: headers,
        redirect: 'follow',
    };

    await fetch(loginUrl, requestOptions)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            throw { message: "ahhhhhhhhh" }
        })
        .then(res => {
            setCookie([['token', res.access_token]]);
            setCookie([['name', res.name]]);
            document.location.href = '/';
        })
        .catch(err => console.log("error", err))

    loginButton.disabled = false;
    // console.log(email)
    // console.log(password)
}

function setCookie(cookieValues) {
    var d = new Date();
    d.setTime(d.getTime() + (60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();

    let cookies = "";
    cookieValues.forEach(item => {
        cookies = cookies + item[0] + '=' + item[1] + ';';
        document.cookie = cookies + expires + ";path=/";
    });
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const CLIENT_ID = "742891582769-kve9i6a70635sc5lpme2hajavihogu17.apps.googleusercontent.com";
const CLIENT_SECRET = "D2nxKX_rC0k60pxtO3g4xu8Y";
const REDIRECT_URI = "http://localhost:3000/google/callback"; //TODO Update to heroku uri
const RESPONSE_TYPE = "id_token";
const STATE = "LKJSAKL";
const SCOPE = "openid profile email";
const PROMPT = "consent";

function create_google_oauth_url() {
    let nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    let url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&state=${STATE}&scope=${SCOPE}&prompt=${PROMPT}&nonce=${nonce}`

    return url;
}

function loginGoogleAction() {
    let url = create_google_oauth_url();
    window.location.replace(url);
}