import bcrypt from "bcrypt"

import User from "../models/user.model.js"
import generateTokenAndSetCookie from "../utils/generateToken.js"

export const signup = async (req, res) => {
    try {
        const { fullname, uname, passwd, cpasswd, gender } = req.body

        if (passwd !== cpasswd) {
            return res.status(400).json({
                error: "Passwords do not match"
            })
        }

        const user = await User.findOne({ uname })
        if (user) {
            return res.status(400).json({
                error: "User already exists"
            })
        }

        // hashed password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(passwd, salt)

        // Profile Pictures
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${uname}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${uname}`

        const newUser = new User({
            fullname,
            uname,
            passwd: hashedPassword,
            gender,
            profilePicture: gender === "male" ? boyProfilePic : girlProfilePic
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()
        } else { res.status(400).json({ error: "Invalid user data" }) }

        res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            uname: newUser.uname,
            profilePicture: newUser.profilePicture
        })
    }

    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const signin = async (req, res) => {
    try {
        const { uname, passwd } = req.body
        const user = await User.findOne({ uname })
        const checkPasswd = await bcrypt.compare(passwd, user?.passwd || "")

        if (!uname || !checkPasswd) {
            return res.status(400).json({
                error: "Invalid Username and Password"
            })
        }

        generateTokenAndSetCookie(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            uname: user.uname,
            profilePicture: user.profilePicture
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const signout = (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 })
        res.status(200).json({
            message: "Successfully Signed out"
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

