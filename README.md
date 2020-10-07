# CRUDShoppingPortal

This project consists of a web application consisting of a front-end and back-end, and a JSON based REST-ful web service. Both will connect to a MongoDB cluster.


# Basic Requirements
## Web App
- [ ] User Registration
- [ ] Login / Logout
- [x] MongoDB as Database
- [x] View items without Auth
- [x] Dynamic Endpoints
- [x] Client Side JS
- [ ] OAuth/OpenID
- [ ] Host on Cloud
- [x] MVC Architecture

## API
- [x] User Registration
- [x] Login / Logout
- [x] MongoDB as Database
- [x] View items without Auth
- [x] Dynamic Endpoints
- [x] Host on Cloud
- [x] MVC Architecture

## REST

### Hat objects

```json
{
    "_id":          "The id of the hat in the database",
    "name":         "Name of the hat",
    "price":        "The price of the hat",
    "color":        "The color of the hat",
    "animal":       "The animal the hat is for",
    "size":         "The size of the animal",
    "design":       "The type of hat",
    "imageUrl":     "A url that leads to the image for the hat"
}
```

### Requests

| Request type | URL | Body | Description |
|-|-------|---|----|
| GET | <https://limitless-cove-65021.herokuapp.com/api/hats> | *None* | Get the list of hats |
| POST | <https://limitless-cove-65021.herokuapp.com/api/hats> | **Hat JSON** *without the `_id` property* | Add a hat to the list of hats |
| GET | <https://limitless-cove-65021.herokuapp.com/api/hats/:id> | *None* | Get the hat with the specified id |
| PUT | <https://limitless-cove-65021.herokuapp.com/api/hats/:id> | **Hat JSON** | Update the hat with the specified id to the given hat |
| DELETE | <https://limitless-cove-65021.herokuapp.com/api/hats/:id> | *None* | Delete the hat with the specified id |

### Deploying to Heroku

Make some changes to the code and deploy them to Heroku using Git.

```bash
$ git add .
$ git commit -am "Commit message"
$ git push heroku master

...
#Remote output
...
remote: Verifying deploy... done.
To https://git.heroku.com/limitless-cove-65021.git
   963c2b4..fab490b  master -> master

```
