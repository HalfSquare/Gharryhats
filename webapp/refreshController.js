window.addEventListener("load", init);

function init() {
  refreshToken()
    .then((result) => {
      setCookie([["token", result.access_token]]);
      setCookie([["name", result.name]]);
      document.location.href = "/";
    })
    .catch((err) => {
        logout();
        document.location.href = "/auth/login";
    });
}

function logout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function setCookie(cookieValues) {
  var d = new Date();
  d.setTime(d.getTime() + 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();

  let cookies = "";
  cookieValues.forEach((item) => {
    cookies = cookies + item[0] + "=" + item[1] + ";";
    document.cookie = cookies + expires + ";path=/";
  });
}

async function refreshToken() {
  return new Promise(async (resolve, reject) => {
    let refreshUrl = 'https://limitless-cove-65021.herokuapp.com/auth/refresh';
    // let refreshUrl = "http://localhost:8080/api/auth/refresh";
    var headers = {
      "Content-Type": "applocation/json",
      Accept: "application/json, text/plain, */*",
      refresh_token: getRefreshToken()
    };

    let requestOptions = {
      method: "POST",
      headers: headers,
      redirect: "follow"
    };

    let response;
    await fetch(refreshUrl, requestOptions)
      .then((result) => {
        response = result;
        return result.json();
      })
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((err) => {
        reject(new Error("ValidationError"));
      });
  });
}

function getRefreshToken() {
  let storage = window.localStorage;
  return storage.getItem("refresh");
}
