import jwtpkg from "jsonwebtoken";

const { sign, decode, verify } = jwtpkg;

function refreshToken(payload) {
  const newExp = Math.floor(Date.now() / 1000) + 3600;
  const newPayload = { ...payload };
  newPayload.exp = newExp;
  const refreshedToken = sign(newPayload, process.env.REFRESH_TOKEN_PRIVATE_KEY);

  return refreshedToken;
}

const jwtMiddleware = (req, res, next) => {
  const authorizationHeader = req.header("Authorization") || req.headers["refresh-token"];

  if (!authorizationHeader) {
    return res
      .status(401)
      .json({ message: "Access denied. Please log in." });
  }

  try {
    const token = authorizationHeader.replace("Bearer ", "");

    if (token) {
      verify(token, process.env.JWT_KEY, (error, decoded) => {
        if (error) {
          if (error.name === "TokenExpiredError") {
            const payload = decode(token);
            const refreshedToken = refreshToken(payload);
            if (refreshedToken) {
              res.setHeader("Authorization", refreshedToken);
              const role = decoded.userRole;
              const { id } = decoded;
              req.id = id;
              req.userRole = role;
              return next();
            } return res.status(401).send("Unauthorized");
          } if (error.message === "invalid token") {
            return res.status(401).json({ message: "Access denied. Invalid token." });
          } return res.end();
        } const role = decoded.userRole;
        const { id } = decoded;
        req.id = id;
        req.userRole = role;
        return next();
      });
    }
    return token;
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Token verification error", error });
  }
};

export default jwtMiddleware;
