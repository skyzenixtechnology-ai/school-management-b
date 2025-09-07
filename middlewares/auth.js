import jwt from 'jsonwebtoken'
/**
 * Verifies the JWT token in the Authorization header of the request.
 * If the token is valid, attaches the decoded user information to the request object.
 * If the token is missing or invalid, sends an appropriate error response.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function to be executed.
 * @returns {void}
 */
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];

    console.log("🚀 ~ verifyToken ~ token:", token);

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        const user = jwt.decode(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch {
        res.status(401).send({ message: "Invalid token" });
    }

}
export default verifyToken;