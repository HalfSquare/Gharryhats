const errorCodes = {
  "EmailNotFound": 1,
  "CredentialsNotGiven": 2,
  "ValidationError": 3,
  "UserNotFound": 4,
  "HatNotFound": 5,
  "InvalidPassword": 6
}

const error = function(code) {return { name: "CustomMongoError", code: errorCodes[code] }; }

exports.errorCodes = errorCodes;
exports.Error = error;