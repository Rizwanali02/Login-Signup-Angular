import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken';



const isAuthenticated = async (req, res, next) => {

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ success: false, message: "User is not authenticated" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};


export { isAuthenticated }