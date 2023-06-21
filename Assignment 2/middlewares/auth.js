const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
  const authorizationHeader =
    req.header("Authorization") || req.headers["refresh-token"];

  if (!authorizationHeader) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const token = authorizationHeader.replace("Bearer ", "");

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_KEY, (error) => {
        if (error) {
          if (error.name === "TokenExpiredError") {
            const payload = jwt.decode(token);
            const refreshedToken = refreshToken(payload);
            if (refreshedToken) {
              res.setHeader("Authorization", refreshedToken);
              next();
            } else {
              res.status(401).send("Unauthorized");
              res.end();
            }
          } else if (error.message === "invalid token") {
            res.status(401).json({ message: "Access denied. Invalid token." });
            res.end();
          } else {
            res.end();
            next();
          }
        } else {
          next();
        }
      });
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Token verification error", error });
  }
};

function refreshToken(payload) {
  const newExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour

  payload.exp = newExp;

  const refreshedToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_PRIVATE_KEY
  );

  return refreshedToken;
}
module.exports = jwtMiddleware;
