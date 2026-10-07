const express = require("express")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const rateLimit = require("express-rate-limit")

const User = require("../models/User")
const protect = require("../middleware/authMiddleware")

const router = express.Router()


// ==========================================
// FORGOT PASSWORD RATE LIMITER
// ==========================================

const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message:
            "Too many password reset requests. Please try again later."
    }
})


// ==========================================
// GET PROFILE
// ==========================================

router.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select("-password")

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json(user)

    } catch (error) {
        console.error("GET PROFILE ERROR:", error)

        res.status(500).json({
            message: "Server error"
        })
    }
})


// ==========================================
// UPDATE PROFILE
// ==========================================

router.put("/profile", protect, async (req, res) => {
    try {
        const { name, email } = req.body

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            })
        }

        const existingUser = await User.findOne({
            email,
            _id: { $ne: req.userId }
        })

        if (existingUser) {
            return res.status(400).json({
                message: "Email is already in use"
            })
        }

        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        user.name = name
        user.email = email

        const updatedUser = await user.save()

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        })

    } catch (error) {
        console.error("UPDATE PROFILE ERROR:", error)

        res.status(500).json({
            message: "Server error"
        })
    }
})


// ==========================================
// CHANGE PASSWORD
// ==========================================

router.put("/change-password", protect, async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword
        } = req.body

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message:
                    "Current password and new password are required"
            })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message:
                    "New password must be at least 6 characters"
            })
        }

        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const isPasswordCorrect =
            await bcrypt.compare(
                currentPassword,
                user.password
            )

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message:
                    "Current password is incorrect"
            })
        }

        const hashedPassword =
            await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword

        await user.save()

        res.status(200).json({
            message:
                "Password changed successfully"
        })

    } catch (error) {
        console.error(
            "CHANGE PASSWORD ERROR:",
            error
        )

        res.status(500).json({
            message: "Server error"
        })
    }
})


// ==========================================
// FORGOT PASSWORD
// ==========================================

router.post(
    "/forgot-password",
    forgotPasswordLimiter,
    async (req, res) => {
        try {
            const { email } = req.body

            if (!email) {
                return res.status(400).json({
                    message: "Email is required"
                })
            }

            const user = await User.findOne({
                email
            })

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                })
            }

            // Generate random reset token
            const resetToken =
                crypto
                    .randomBytes(32)
                    .toString("hex")

            // Hash token before storing
            // it in MongoDB
            const hashedResetToken =
                crypto
                    .createHash("sha256")
                    .update(resetToken)
                    .digest("hex")

            // Store hashed token
            user.resetPasswordToken =
                hashedResetToken

            // Token expires after 15 minutes
            user.resetPasswordExpires =
                Date.now() +
                15 * 60 * 1000

            await user.save()

            // Create Gmail transporter
            const transporter =
                nodemailer.createTransport({
                    service: "gmail",

                    auth: {
                        user:
                            process.env.EMAIL_USER,

                        pass:
                            process.env.EMAIL_PASS
                    }
                })

            // Frontend reset URL
            const resetLink =
                `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

            await transporter.sendMail({
                from:
                    process.env.EMAIL_USER,

                to:
                    user.email,

                subject:
                    "Finance Tracker - Password Reset",

                html: `
                    <div style="
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: auto;
                        padding: 30px;
                    ">

                        <h2>
                            Password Reset
                        </h2>

                        <p>
                            Hello ${user.name},
                        </p>

                        <p>
                            You requested to reset
                            your Finance Tracker
                            password.
                        </p>

                        <p>
                            Click the button below
                            to reset your password.
                        </p>

                        <a
                            href="${resetLink}"
                            style="
                                display: inline-block;
                                padding: 12px 20px;
                                background: #2563eb;
                                color: white;
                                text-decoration: none;
                                border-radius: 6px;
                                font-weight: bold;
                            "
                        >
                            Reset Password
                        </a>

                        <p style="
                            margin-top: 25px;
                        ">
                            This link will expire
                            in
                            <strong>
                                15 minutes
                            </strong>.
                        </p>

                        <p>
                            If you did not request
                            this, you can safely
                            ignore this email.
                        </p>

                        <p>
                            Finance Tracker
                        </p>

                    </div>
                `
            })

            res.status(200).json({
                message:
                    "Password reset link sent to your email"
            })

        } catch (error) {
            console.error(
                "FORGOT PASSWORD ERROR:",
                error
            )

            res.status(500).json({
                message:
                    "Failed to send password reset email"
            })
        }
    }
)


// ==========================================
// RESET PASSWORD
// ==========================================

router.put(
    "/reset-password/:token",
    async (req, res) => {
        try {
            const {
                password
            } = req.body

            const {
                token
            } = req.params

            if (!password) {
                return res.status(400).json({
                    message:
                        "New password is required"
                })
            }

            if (password.length < 6) {
                return res.status(400).json({
                    message:
                        "Password must be at least 6 characters"
                })
            }

            // Hash token received
            // from reset URL
            const hashedToken =
                crypto
                    .createHash("sha256")
                    .update(token)
                    .digest("hex")

            // Find user with valid token
            const user =
                await User.findOne({
                    resetPasswordToken:
                        hashedToken,

                    resetPasswordExpires: {
                        $gt: Date.now()
                    }
                })

            if (!user) {
                return res.status(400).json({
                    message:
                        "Invalid or expired reset link"
                })
            }

            // Hash new password
            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                )

            user.password =
                hashedPassword

            // Delete reset token
            // after successful reset
            user.resetPasswordToken =
                undefined

            user.resetPasswordExpires =
                undefined

            await user.save()

            res.status(200).json({
                message:
                    "Password reset successfully"
            })

        } catch (error) {
            console.error(
                "RESET PASSWORD ERROR:",
                error
            )

            res.status(500).json({
                message: "Server error"
            })
        }
    }
)


module.exports = router