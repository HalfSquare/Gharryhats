window.addEventListener("load",init);
function init(){
    const url = window.location.hash
    let id = url.substring(url.indexOf('id_token=') + 9);
    id = id.substring(0, id.indexOf('&'));
    validate_google_user(id);
}

function validate_google_user(id_token) {
    // let url = 'http://localhost:8080/api/auth/google';
    let url = 'https://limitless-cove-65021.herokuapp.com/api/auth/google'

    var headers = new Headers();
    headers.append('Content-Type', 'text/plain');
    headers.append('Accept', 'application/json, text/plain, */*');
    headers.append('id_token', id_token);

    let requestOptions = {
        method: 'POST',
        headers: headers,
        body: `{'id_token': ${id_token}}`
    };

    fetch(url, requestOptions)
      .then(res=>res.json())
      .then(res => {
            console.log(res)
            let accessToken = res.access_token;
            let refreshToken = res.refresh_token;
            if (accessToken) {
                console.log("token", accessToken)
                
                setCookie([['name', res.name]]);
                setCookie([['token', accessToken]]);
                document.location.href = '/';
            }
        })
      .catch(err => console.log("error", err))
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