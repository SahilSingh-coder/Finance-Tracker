import { useState } from "react"
import api from "../api/axios"

function Profile() {
    const user = JSON.parse(localStorage.getItem("user"))

    const [name, setName] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")
    const [message, setMessage] = useState("")

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordMessage, setPasswordMessage] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            const token = localStorage.getItem("token")

            const response = await api.put(
                "/users/profile",
                {
                    name,
                    email
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            localStorage.setItem(
                "user",
                JSON.stringify(response.data)
            )

            window.dispatchEvent(new Event("userUpdated"))

            setMessage("Profile updated successfully!")

        } catch (error) {
            console.log("PROFILE UPDATE ERROR:", error)

            setMessage(
                error.response?.data?.message ||
                "Failed to update profile"
            )
        }
    }


    async function handlePasswordChange(e) {
        e.preventDefault()

        setPasswordMessage("")

        if (newPassword !== confirmPassword) {
            setPasswordMessage("New passwords do not match")
            return
        }

        if (newPassword.length < 6) {
            setPasswordMessage(
                "New password must be at least 6 characters"
            )
            return
        }

        try {
            const token = localStorage.getItem("token")

            const response = await api.put(
                "/users/change-password",
                {
                    currentPassword,
                    newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setPasswordMessage(response.data.message)

            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")

        } catch (error) {
            console.log("PASSWORD CHANGE ERROR:", error)

            setPasswordMessage(
                error.response?.data?.message ||
                "Failed to change password"
            )
        }
    }


    return (
        <div className="profile-page">

            <div className="profile-card">

                {/* PROFILE HEADER */}

                <div className="profile-header">

                    <div className="profile-avatar">
                        {name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h1>My Profile</h1>
                        <p>
                            Manage your account information
                        </p>
                    </div>

                </div>


                {/* PROFILE INFORMATION */}

                <form onSubmit={handleSubmit}>

                    <div className="profile-field">

                        <label>Full Name</label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Enter your name"
                        />

                    </div>


                    <div className="profile-field">

                        <label>Email Address</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                        />

                    </div>


                    <button
                        type="submit"
                        className="profile-button"
                    >
                        Update Profile
                    </button>

                </form>


                {/* PROFILE MESSAGE */}

                {message && (
                    <p className="profile-message">
                        {message}
                    </p>
                )}


                {/* CHANGE PASSWORD */}

                <div className="password-section">

                    <h2>Change Password</h2>

                    <p className="password-description">
                        Update your password to keep your account secure.
                    </p>


                    <form onSubmit={handlePasswordChange}>

                        <div className="profile-field">

                            <label>Current Password</label>

                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                placeholder="Enter current password"
                            />

                        </div>


                        <div className="profile-field">

                            <label>New Password</label>

                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                                placeholder="Enter new password"
                            />

                        </div>


                        <div className="profile-field">

                            <label>Confirm New Password</label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Confirm new password"
                            />

                        </div>


                        <button
                            type="submit"
                            className="profile-button"
                        >
                            Change Password
                        </button>

                    </form>


                    {passwordMessage && (
                        <p className="password-message">
                            {passwordMessage}
                        </p>
                    )}

                </div>

            </div>

        </div>
    )
}

export default Profile