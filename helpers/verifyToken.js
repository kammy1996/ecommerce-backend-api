import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const token = req.header("Auth-token");
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).send("Invalid Token");
  }
}
