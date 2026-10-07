const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const transactionsRoutes = require("./routes/transactionsRoutes")
const usersRoutes = require("./routes/usersRoutes")

dotenv.config()

connectDB()

const app = express()


// ==========================================
// SECURITY
// ==========================================

// Security HTTP headers
app.use(helmet())

// CORS
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173"
    })
)


// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json())


// ==========================================
// RATE LIMITING
// ==========================================

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        message: "Too many requests. Please try again later."
    }
})


// Protect authentication endpoints
app.use("/api/auth", authLimiter)


// ==========================================
// BASIC ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.send("Finance Tracker Backend is running!")
})


// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes)

app.use("/api/transactions", transactionsRoutes)

app.use("/api/users", usersRoutes)


// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    )
})