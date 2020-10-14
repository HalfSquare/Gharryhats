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
        body: "{'email': 'test@test'}"
    };

    fetch(loginUrl, requestOptions)
      .then(res=>res.json())
      .then(res => console.log("login result", res))
      .catch(err => console.log("error", err))
    // console.log(email)
    // console.log(password)
}