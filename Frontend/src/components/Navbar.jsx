import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Navbar() {
    const navigate = useNavigate()

    const [token, setToken] = useState(localStorage.getItem("token"))
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    )

    useEffect(() => {
        function updateNavbar() {
            setToken(localStorage.getItem("token"))
            setUser(JSON.parse(localStorage.getItem("user")))
        }

        window.addEventListener("userUpdated", updateNavbar)

        return () => {
            window.removeEventListener("userUpdated", updateNavbar)
        }
    }, [])

    function handleLogout() {
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        setToken(null)
        setUser(null)

        navigate("/login")
    }

    return (
        <nav className="navbar">

            <h2>Finance Tracker</h2>

            <div className="navbar-links">

                <a href="/">Home</a>

                {token && (
                    <>
                        <a href="/dashboard">Dashboard</a>
                        <a href="/transactions">Transactions</a>
                        <a href="/analytics">Analytics</a>
                        <a href="/profile">Profile</a>

                        <span>
                            Hello, {user?.name}
                        </span>

                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}

                {!token && (
                    <>
                        <a href="/login">Login</a>
                        <a href="/register">Register</a>
                    </>
                )}

            </div>

        </nav>
    )
}

export default Navbar