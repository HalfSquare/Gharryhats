// Error handler for all endpoints
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ "error": message });
}

// Error handler for mongoose errors
function handleMongooseError(res, err, code) {
  if (err.name === 'MongoError' || err.name === 'CustomMongoError') {
    switch (err.code) {
      case 11000:
        // Email already exists in user database
        res.status(code || 400).json({ "error": "Email address is already linked with an account" })
        break;
      case 1:
        // No matching email in user database
        res.status(code || 401).json({ "error": "Email not associated with a user" })
        break;
      case 2:
        res.status(code || 401).json({ "error": "Credentials invalid. Please provide a user and password or a session token." })
      case 4:
        res.status(code || 401).json({ "error": "No user with matching credentials" })
        break;
      case 6:
        res.status(code || 401).json({ "error": "Incorrect password" })
        break;
      case 7:
        res.status(code || 400).json({ "error": "Please make your password more secure. Include at least one uppercase, one lowercase and one number. Make sure the password is 8 characters long." })
        break;
      default:
        handleError(res, err.message + "\nPlease handle Mongo error code: " + err.code, err.message)
    }
  } else {
    handleError(res, err.message, err.message);
  }
}

exports.handleError = handleError;
exports.handleMongooseError = handleMongooseError;