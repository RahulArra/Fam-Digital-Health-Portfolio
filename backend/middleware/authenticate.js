const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization'); // Get token from headers
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = verified; // Attach user data to request
        next(); // Move to next function
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = authenticate;
