import { useEffect, useState } from "react"
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts"
import api from "../api/axios"

function Analytics() {
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

    // =========================
    // TOTAL INCOME
    // =========================

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

    // =========================
    // TOTAL EXPENSES
    // =========================

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

    // =========================
    // BALANCE
    // =========================

    const balance = income - expenses

    // =========================
    // INCOME VS EXPENSES DATA
    // =========================

    const chartData = [
        {
            name: "Income",
            value: income
        },
        {
            name: "Expenses",
            value: expenses
        }
    ]

    // =========================
    // EXPENSE BY CATEGORY
    // =========================

    const categoryData = transactions
        .filter(
            (transaction) =>
                transaction.type === "expense"
        )
        .reduce((result, transaction) => {

            const existingCategory = result.find(
                (item) =>
                    item.name === transaction.category
            )

            if (existingCategory) {
                existingCategory.value += transaction.amount
            } else {
                result.push({
                    name: transaction.category,
                    value: transaction.amount
                })
            }

            return result

        }, [])

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return <h2>Loading analytics...</h2>
    }

    return (
        <div className="analytics">

            <h1>Analytics</h1>

            {/* =========================
                SUMMARY CARDS
            ========================= */}

            <div className="analytics-cards">

                <div className="analytics-card">
                    <h3>Total Income</h3>
                    <p>₹{income}</p>
                </div>

                <div className="analytics-card">
                    <h3>Total Expenses</h3>
                    <p>₹{expenses}</p>
                </div>

                <div className="analytics-card">
                    <h3>Balance</h3>
                    <p>₹{balance}</p>
                </div>

            </div>


            {/* =========================
                INCOME VS EXPENSES
            ========================= */}

            <div className="chart-container">

                <h2>Income vs Expenses</h2>

                {income === 0 && expenses === 0 ? (

                    <p>
                        No transaction data available
                        for the chart.
                    </p>

                ) : (

                    <ResponsiveContainer
                        width="100%"
                        height={400}
                    >

                        <PieChart>

                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={140}
                                label
                            >

                                {chartData.map(
                                    (entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                index === 0
                                                    ? "#22c55e"
                                                    : "#ef4444"
                                            }
                                        />
                                    )
                                )}

                            </Pie>

                            <Tooltip />

                            <Legend />

                        </PieChart>

                    </ResponsiveContainer>

                )}

            </div>


            {/* =========================
                EXPENSE BY CATEGORY
            ========================= */}

            <div className="chart-container">

                <h2>Expenses by Category</h2>

                {categoryData.length === 0 ? (

                    <p>
                        No expense data available.
                    </p>

                ) : (

                    <ResponsiveContainer
                        width="100%"
                        height={400}
                    >

                        <PieChart>

                            <Pie
                                data={categoryData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={140}
                                label
                            >

                                {categoryData.map(
                                    (entry, index) => (
                                        <Cell
                                            key={`category-${index}`}
                                            fill={
                                                [
                                                    "#3b82f6",
                                                    "#8b5cf6",
                                                    "#f59e0b",
                                                    "#08b6d4",
                                                    "#ec4899",
                                                    "#14b8a6"
                                                ][index % 6]
                                            }
                                        />
                                    )
                                )}

                            </Pie>

                            <Tooltip />

                            <Legend />

                        </PieChart>

                    </ResponsiveContainer>

                )}

            </div>

        </div>
    )
}

export default Analytics