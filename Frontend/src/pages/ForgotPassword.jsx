import { useState } from "react"
import api from "../api/axios"

function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        setMessage("")

        if (!email) {
            setMessage("Please enter your email")
            return
        }

        try {
            setLoading(true)

            const response = await api.post(
                "/users/forgot-password",
                { email }
            )

            setMessage(response.data.message)

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to send reset link"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login">
            <h1>Forgot Password</h1>

            <p>
                Enter your registered email address and
                we'll send you a password reset link.
            </p>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>

            {message && <p>{message}</p>}
        </div>
    )
}

export default ForgotPassword