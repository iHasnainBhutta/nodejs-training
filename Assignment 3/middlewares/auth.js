import jwtpkg from "jsonwebtoken";
const { sign, decode, verify } = jwtpkg;

export const jwtMiddleware = (req, res, next) => {
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
      const decoded = verify(token, process.env.JWT_KEY, (error, decoded) => {
        if (error) {
          if (error.name === "TokenExpiredError") {
            const payload = decode(token);
            const refreshedToken = refreshToken(payload);
            if (refreshedToken) {
              res.setHeader("Authorization", refreshedToken);
              const role = decoded.userRole;
              req.userRole = role;
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
          }
        } else {
          const role = decoded.userRole;
          req.userRole = role;
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

  const refreshedToken = sign(payload, process.env.REFRESH_TOKEN_PRIVATE_KEY);

  return refreshedToken;
}
