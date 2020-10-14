const CLIENT_ID = "742891582769-kve9i6a70635sc5lpme2hajavihogu17.apps.googleusercontent.com";
const CLIENT_SECRET = "D2nxKX_rC0k60pxtO3g4xu8Y";
const REDIRECT_URI = "http://localhost:8080/google/callback"; //TODO Update to heroku uri
const RESPONSE_TYPE = "id_token";
const STATE = "LKJSAKL";
const SCOPE = "openid";
const PROMPT = "consent";

function create_google_oauth_url() {
    let nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    let url = `https://accounts.google.com/o/oauth2/v2/auth
    ?client_id=${CLIENT_ID}
    &response_type=${RESPONSE_TYPE}
    &redirect_uri=${REDIRECT_URI}
    &state=${STATE}
    &scope=${SCOPE}
    &prompt=${PROMPT}
    &nonce=${nonce}`
}