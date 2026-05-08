const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {

  let token = req.headers.authorization;

  if (!token) {
    req.user = null;
    return next();
  }

  token = token.split(" ")[1];

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Invalid token"
    });

  }

};

module.exports = protect;