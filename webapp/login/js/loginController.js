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
    console.log("Login press")
}