const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    try {
        // Get the Authorization header from the request
        const authorizationHeader = req.headers.authorization;

        // Check if Authorization header is missing
        if (!authorizationHeader) {
            return res.status(401).json({ error: 'Unauthorized - Missing Authorization Header' });
        }

        // Extract the token from the Authorization header
        const token = authorizationHeader.split(' ')[1];

        // Check if token is missing
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - Missing Token' });
        }

        // Verify the token using the secret
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Extract user ID from the decoded token
        req.userId = decodedToken.userId;

        // Find the user in the database using the user ID
        const user = await User.findById(req.userId);

        // Check if the user is not found
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized - User not found' });
        }

        // Move to the next middleware or route handler
        next();
    } catch (error) {
        // Handle any errors during token verification or user lookup
        console.error(error);
        res.status(401).json({ error: 'Unauthorized - Invalid Token' });
    }
};

module.exports = authMiddleware;
