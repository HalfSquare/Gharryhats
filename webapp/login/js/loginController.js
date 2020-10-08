window.addEventListener("load",init);
function init(){
    document.querySelector('#loginBtn').addEventListener('click',loginAction);
    document.querySelector('#forgotPassword').addEventListener('click',forgotPassAction);
    document.querySelector('#signUp').addEventListener('click',signUpAction);
}

function forgotPassAction() {
    console.log("Forgot password press")
}

function signUpAction() {
    console.log("Sign up press")
}

function loginAction() {
    let loginUrl = 'http://localhost:8080/api/auth/login'
    let email = document.querySelector("#login").value
    let password = document.querySelector("#password").value
    fetch(loginUrl, {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    })
    .then(res=>res.json())
    .then(res => console.log(res));
    console.log(email)
    console.log(password)
    console.log("Login press")
}