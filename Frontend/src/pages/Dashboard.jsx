import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios"

function Dashboard() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTransactions()
    }, [])

    async function fetchTransactions() {
        try {
            const token = localStorage.getItem("token")

            const response = await api.get("/transactions", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setTransactions(response.data)
        } catch (error) {
            console.log(
                error.response?.data?.message ||
                error.message
            )
        } finally {
            setLoading(false)
        }
    }

    // Calculate total income
    const income = transactions
        .filter(
            (transaction) =>
                transaction.type === "income"
        )
        .reduce(
            (total, transaction) =>
                total + transaction.amount,
            0
        )

    // Calculate total expenses
    const expenses = transactions
        .filter(
            (transaction) =>
                transaction.type === "expense"
        )
        .reduce(
            (total, transaction) =>
                total + transaction.amount,
            0
        )

    // Calculate balance
    const balance = income - expenses

    // Get latest 5 transactions
    const recentTransactions =
        transactions.slice(0, 5)

    if (loading) {
        return (
            <div className="dashboard">
                <h2>Loading dashboard...</h2>
            </div>
        )
    }

    return (
        <div className="dashboard">

            <h1>Dashboard</h1>

            {/* SUMMARY CARDS */}
            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <h3>Total Balance</h3>
                    <p>₹{balance}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Total Income</h3>
                    <p>₹{income}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Total Expenses</h3>
                    <p>₹{expenses}</p>
                </div>

            </div>

            {/* QUICK ACTIONS */}
            <div className="dashboard-actions">

                <Link
                    to="/transactions"
                    className="dashboard-button"
                >
                    Add Transaction
                </Link>

                <Link
                    to="/transactions"
                    className="dashboard-button secondary"
                >
                    View All Transactions
                </Link>

                <Link
                    to="/analytics"
                    className="dashboard-button secondary"
                >
                    View Analytics
                </Link>

            </div>

            {/* RECENT TRANSACTIONS */}
            <div className="recent-transactions">

                <div className="recent-header">
                    <h2>Recent Transactions</h2>

                    <Link to="/transactions">
                        View All
                    </Link>
                </div>

                {recentTransactions.length === 0 ? (

                    <p>
                        No transactions yet.
                    </p>

                ) : (

                    <div className="recent-list">

                        {recentTransactions.map(
                            (transaction) => (

                                <div
                                    key={transaction._id}
                                    className="recent-item"
                                >

                                    <div>
                                        <strong>
                                            {transaction.category}
                                        </strong>

                                        <p>
                                            {transaction.description ||
                                                "No description"}
                                        </p>
                                    </div>

                                    <div className="recent-right">

                                        <strong
                                            className={
                                                transaction.type ===
                                                "income"
                                                    ? "income-text"
                                                    : "expense-text"
                                            }
                                        >
                                            {transaction.type ===
                                            "income"
                                                ? "+"
                                                : "-"}
                                            ₹
                                            {transaction.amount}
                                        </strong>

                                        <span>
                                            {transaction.date
                                                ? new Date(
                                                    transaction.date
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )
                                                : "-"}
                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>
                )}

            </div>

        </div>
    )
}

export default Dashboard