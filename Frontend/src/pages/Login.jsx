import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const navigate = useNavigate()
    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const response = await api.post("/auth/login", {
                email, 
                password
            })

            //save JWT token
            localStorage.setItem(
                "token", response.data.token
            )

            //save user information
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            )
            setMessage("Login successful!")

            //go to dashboard
            navigate("/dashboard")
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Login failed"
            )
        }
    }
    return (
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => 
                    setEmail(e.target.value)
                }
                />

                <input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => 
                    setPassword(e.target.value)
                }
                />

                <button type="submit">
                    Login
                </button>
            </form>

            <a href="/forgot-password">
    Forgot Password?
</a>

            {message && (
                <p>{message}</p>
            )}
        </div>
    )
}

export default Login