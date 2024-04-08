import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Hashing user password for save database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (error) {
        return next(error);
    }
});

// Compare login user: enter password is correct
userSchema.methods.comparePassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token 
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

export const User = mongoose.model("User", userSchema);
