const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

async function isLoggedIn(req, res, next) {
    try {
        let token = req.cookies.token;

        if (!token) {
            const headerToken = req.headers.authorization || req.headers.Authorization;
            if (headerToken && headerToken.startsWith("Bearer ")) {
                token = headerToken.split(" ")[1];
            }
        }

        if (!token) {
            return res.status(401).json({ errorMessage: "Unauthorized, no token found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({ errorMessage: "Unauthorized, no user found" });
        }

        if (!req.user.signupVerification) {
            return res.status(401).json({ errorMessage: "Unauthorized, please verify your email" });
        }

        // If all checks pass, proceed to the next middleware or route handler
        next();
    } catch (e) {
        console.log(e);
        return res.status(401).json({ errorMessage: "Unauthorized, invalid token" });
    }
}

module.exports = { isLoggedIn };
