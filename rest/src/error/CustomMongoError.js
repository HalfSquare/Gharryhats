const errorCodes = {
  "EmailNotFound": 1,
  "CredentialsNotGiven": 2,
  "ValidationError": 3,
  "UserNotFound": 4,
  "HatNotFound": 5,
  "InvalidPassword": 6,
  "PasswordNotComplex": 7,
  "NoCartFoundForUser": 8,
  "NoClient": 9,
}

const error = function(code) {return { name: "CustomMongoError", code: errorCodes[code] }; }

exports.errorCodes = errorCodes;
exports.Error = error;