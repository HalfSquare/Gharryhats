window.addEventListener("load",init);

let password;
let confirmPassword;
let email;
let name;

let passwordValid = true;
let confirmPasswordValid = true;
let emailValid = true; 
let nameValid = true;


let passwordValidText;
let confirmPasswordValidText;
let emailValidText;
let nameValidText;

function init(){
    document.querySelector('#signupButton').addEventListener('click', signupAction);

    password = document.getElementById('password');
    confirmPassword = document.getElementById('confirmPassword');
    email = document.getElementById('email');
    name = document.getElementById('name');

    passwordValidText = document.getElementById('passwordValidText');
    confirmPasswordValidText = document.getElementById('confirmPasswordValidText');
    emailValidText = document.getElementById('emailValidText');
    nameValidText = document.getElementById('nameValidText');

    validationTextsUpdate();
}

async function signupAction() {
    console.log("signup!")

    let signupUrl = 'https://limitless-cove-65021.herokuapp.com/api/auth/signup';
    // let signupUrl = 'http://localhost:8080/api/auth/signup';

    emailValid = !!email.value;
    nameValid = !!name.value;
    confirmPasswordValid = confirmPassword.value === password.value;

    if (emailValid && nameValid && confirmPasswordValid) {
        var headers = new Headers();
        headers.append('Content-Type', 'applocation/json');
        headers.append('Accept', 'application/json, text/plain, */*');
        headers.append('email', email.value);
        headers.append('name', name.value);
        headers.append('password', password.value);
        
        let requestOptions = {
            method: 'POST',
            headers: headers,
            redirect: 'follow',
        };
        
        
        console.log('signup request');
        let response;
        await fetch(signupUrl, requestOptions)
            .then(res => {response = res; return res.json()})
            .then(res => console.log("Signup Result", res))
            .catch(err => console.log("error", err))

        if (response.ok) {
            console.log('ok!')
            document.location.href = '/auth/signupDone';
        } else {
            console.log('no:', response.status);
            passwordValid = false;
        }
        console.log('after req');
    }


    validationTextsUpdate();
}

function validationTextsUpdate() {
    passwordValidText.style.visibility = passwordValid ? 'hidden' : 'visible';
    confirmPasswordValidText.style.visibility = confirmPasswordValid ? 'hidden' : 'visible';
    emailValidText.style.visibility = emailValid ? 'hidden' : 'visible';
    nameValidText.style.visibility = nameValid ? 'hidden' : 'visible';
}