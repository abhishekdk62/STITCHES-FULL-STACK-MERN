const jwt = require("jsonwebtoken");

const generateToken = (id, role,KEY,expiry ) => {  // Include role here
  if (!KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables");
  }

  return jwt.sign({ id, role }, KEY, { expiresIn: expiry });  // Include role in payload
};

module.exports = generateToken;


