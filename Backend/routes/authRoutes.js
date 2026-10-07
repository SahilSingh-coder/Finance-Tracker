const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const protect = require("../middleware/authMiddleware")

const router = express.Router()


// =========================
// REGISTER
// =========================

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
})


// =========================
// LOGIN
// =========================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        // Check details
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        // Find user
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        )

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        // Create JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        console.log("LOGIN ERROR:", error)

        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
})


// =========================
// GET PROFILE
// =========================

router.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password")

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json(user)

    } catch (error) {
        console.log("GET PROFILE ERROR:", error)

        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
})


// =========================
// UPDATE PROFILE
// =========================

router.put("/profile", protect, async (req, res) => {
    try {
        const { name, email } = req.body

        // Check required fields
        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            })
        }

        // Find logged-in user
        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        // Update user
        user.name = name
        user.email = email

        const updatedUser = await user.save()

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email
            }
        })

    } catch (error) {
        console.log("UPDATE PROFILE ERROR:", error)

        res.status(500).json({
            message: "Failed to update profile",
            error: error.message
        })
    }
})


module.exports = router