import { User } from "../models/user.model.js";
import { sendToken } from "../utils/jwtToken.js";



const signUpUserController = async (req, res) => {

    try {
        const { username, email, fullName, password } = req.body;

        if ([username, email, fullName, password].some((filed) => filed?.trim() === "")) {
            return res.json({ message: "All fields are required" })
        }

        const existedUser = await User.findOne({ email });

        if (existedUser) {
            return res.status(400).json({
                success: "false",
                message: "User already exists"
            });
        }

        const user = await User.create({
            fullName,
            username,
            email,
            password,
        });


        sendToken(user, 200, "User Registered Successfully", res);

    } catch (error) {
        console.log(`Error in signUp Controoler ${error}`);
        res.status(500).json({
            success: "false",
            message: "Error Signup controller",
            error
        });
    }

}

const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        //fing user in dababase
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email is not signed in"
            });
        }

        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return res.status(404).json({
                success: false,
                message: "Invalid Password"
            });
        }

        sendToken(user, 200, "User logged in successfully", res);

    } catch (error) {
        console.log(`Error in login Controller ${error}`);
        res.status(500).json({
            success: false,
            message: "Error in login Controller",
            error
        });
    }
};



const logoutUserController = (req, res) => {
    try {
        res.status(200).clearCookie("token").json({
            success: true,
            message: "User logged out"
        });
    } catch (error) {
        console.error("Error in logout route:", error);
        res.status(500).json({ success: false, message: "Error in logout." });
    }
}



const allUsersController = async (req, res) => {
    const { _id } = req.user;
    try {
        const allUsers = await User.find({ _id: { $ne: _id } });
        if (!allUsers || allUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No other users found"
            });
        }
        res.status(200).json({
            success: true,
            message: "All Users",
            allUsers
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


const editUserController = async (req, res) => {
    try {

        const  id  = req.user._id

        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const newUserData = {
            fullName: req.body.fullName,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }

        user = await User.findByIdAndUpdate(id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            message: "User Update Successfully",
            user
        })

    } catch (error) {
        console.error("Error in editUserController:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const deleteUserController = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteUserController:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export {
    signUpUserController,
    loginUserController,
    logoutUserController,
    allUsersController,
    editUserController,
    deleteUserController
}