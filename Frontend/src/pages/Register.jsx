import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    const navigate = useNavigate()
    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const response = await api.post(
                "/auth/register",
                {
                    name,
                    email, 
                    password
                }
            )
            setMessage(response.data.message)

            //go to login after successful registration
            navigate("/login")
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Registration failed"
            )
        }
    }
    return (
        <div className="register">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => 
                    setName(e.target.value)
                }
                />

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
                plaaceholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                
                <button type="submit">
                    Register
                </button>
                </form>

                {message && (
                    <p>{message}</p>
                )}
        </div>
    )
}

export default Register