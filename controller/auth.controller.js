import bcrypt from 'bcryptjs';
import User from "../models/userModel.js";
import generateTokenAndSetCoookie from '../utils/generateTokenAndSetCookie.js';

export const signUp = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            res.status(400).json({ error: "password doesn't match" });
        }

        const user = await User.findOne({ username });

        if (user) {
            res.status(400).json({ error: "User already exists!" });
        }

        // Hashing password

        //here salt has value in getsalt function. the higher value it will take more time to encrypt   
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // https://avatar.iran.liara.run/public/boy?username=nick 

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        })


        if (newUser) {
            //generating JWT token
            //    const {token}= generateTokenAndSetCoookie(newUser._id, res);
            generateTokenAndSetCoookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
            // localStorage.setItem("token",token);
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const logIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || ""); //if you ain't use "|| "" " then you get error because campare function works on empty string if there is not any campare password

        if (!user || !isPasswordCorrect) {
            res.status(400).json({ error: "Invalid username or password!" })
        }

        // generate token for it 
        // const { token } = generateTokenAndSetCoookie(user._id, res);
        else {

            generateTokenAndSetCoookie(user._id, res);

            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                profilePic: user.profilePic,

            })
        }
        // localStorage.setItem("token", token);
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const logOut = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({ error: "Internal server error" })
    }
}

