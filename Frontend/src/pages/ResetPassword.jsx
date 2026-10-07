import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../api/axios"

function ResetPassword() {
    const { token } = useParams()
    const navigate = useNavigate()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventsDefault()
        setMessage("")
        if (password !== confirmPassword) {
            setMessage("Passwords do not match")
            return
        }

        if (password.length < 6) {
            setMessage("Password must be at least 6 characters")
            return
        }

        try {
            setLoading(true)

            const response = await api.put(
                `/users/reset-password/${token}`,
                {
                    password
                }
            )
            setMessage(response.data.message)
            setTimeout(() => {
                navigate("/login")
            }, 1500)
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to react password"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login">
            <h1>Reset Password</h1>

            <form onSubmit={handleSubmit}>
                <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

                <input 
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => 
                    setConfirmPassword(e.target.value)
                }
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>

            {message && <p>{message}</p>}
        </div>
    )
}

export default ResetPassword