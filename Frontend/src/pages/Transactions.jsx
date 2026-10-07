import { useEffect, useState } from "react"
import api from "../api/axios"

function Transactions() {
    const [transactions, setTransactions] = useState([])

    // Transaction form states
    const [amount, setAmount] = useState("")
    const [type, setType] = useState("expense")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState("")

    // Search and filter states
    const [search, setSearch] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [filterCategory, setFilterCategory] = useState("all")

    // Edit state
    const [editingId, setEditingId] = useState(null)

    // Fetch transactions when page loads
    useEffect(() => {
        fetchTransactions()
    }, [])

    // Get transactions from backend
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
        }
    }

    // Add / Update transaction
    async function handleSubmit(e) {
        e.preventDefault()

        try {
            const token = localStorage.getItem("token")

            const data = {
                amount: Number(amount),
                type,
                category,
                description,
                date: date || new Date().toISOString()
            }

            // UPDATE
            if (editingId) {
                const response = await api.put(
                    `/transactions/${editingId}`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                setTransactions(
                    transactions.map((transaction) =>
                        transaction._id === editingId
                            ? response.data
                            : transaction
                    )
                )

                setEditingId(null)
            }

            // ADD
            else {
                const response = await api.post(
                    "/transactions",
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                setTransactions([
                    response.data,
                    ...transactions
                ])
            }

            // Reset form
            setAmount("")
            setType("expense")
            setCategory("")
            setDescription("")
            setDate("")

        } catch (error) {
            console.log(
                error.response?.data?.message ||
                error.message
            )
        }
    }

    // Start editing a transaction
    function handleEdit(transaction) {
        setEditingId(transaction._id)

        setAmount(String(transaction.amount))
        setType(transaction.type)
        setCategory(transaction.category)
        setDescription(transaction.description || "")

        setDate(
            transaction.date
                ? transaction.date.split("T")[0]
                : ""
        )
    }

    // Delete transaction
    async function handleDelete(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this transaction?"
        )

        if (!confirmDelete) {
            return
        }

        try {
            const token = localStorage.getItem("token")

            await api.delete(`/transactions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setTransactions(
                transactions.filter(
                    (transaction) =>
                        transaction._id !== id
                )
            )

        } catch (error) {
            console.log(
                error.response?.data?.message ||
                error.message
            )
        }
    }

    // Cancel editing
    function handleCancelEdit() {
        setEditingId(null)
        setAmount("")
        setType("expense")
        setCategory("")
        setDescription("")
        setDate("")
    }

    // Search + Type + Category filtering
    const filteredTransactions = transactions.filter(
        (transaction) => {

            const matchesSearch =
                transaction.category
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||

                transaction.description
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

            const matchesType =
                filterType === "all" ||
                transaction.type === filterType

            const matchesCategory =
                filterCategory === "all" ||
                transaction.category === filterCategory

            return (
                matchesSearch &&
                matchesType &&
                matchesCategory
            )
        }
    )

    // Get unique categories
    const categories = [
        ...new Set(
            transactions.map(
                (transaction) =>
                    transaction.category
            )
        )
    ]

    return (
        <div className="transactions">

            <h1>Transactions</h1>

            {/* SEARCH AND FILTERS */}
            <div className="transaction-filters">

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                {/* Type filter */}
                <select
                    value={filterType}
                    onChange={(e) =>
                        setFilterType(e.target.value)
                    }
                >
                    <option value="all">
                        All Types
                    </option>

                    <option value="income">
                        Income
                    </option>

                    <option value="expense">
                        Expense
                    </option>
                </select>

                {/* Category filter */}
                <select
                    value={filterCategory}
                    onChange={(e) =>
                        setFilterCategory(e.target.value)
                    }
                >
                    <option value="all">
                        All Categories
                    </option>

                    {categories.map((category) => (
                        <option
                            key={category}
                            value={category}
                        >
                            {category}
                        </option>
                    ))}
                </select>

            </div>

            {/* ADD / EDIT FORM */}
            <form onSubmit={handleSubmit}>

                {/* Amount */}
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) =>
                        setAmount(e.target.value)
                    }
                />

                {/* Type */}
                <select
                    value={type}
                    onChange={(e) =>
                        setType(e.target.value)
                    }
                >
                    <option value="expense">
                        Expense
                    </option>

                    <option value="income">
                        Income
                    </option>
                </select>

                {/* Category */}
                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) =>
                        setCategory(e.target.value)
                    }
                />

                {/* Description */}
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                />

                {/* Date */}
                <input
                    type="date"
                    value={date}
                    onChange={(e) =>
                        setDate(e.target.value)
                    }
                />

                {/* Submit */}
                <button type="submit">
                    {editingId
                        ? "Update Transaction"
                        : "Add Transaction"}
                </button>

                {/* Cancel edit */}
                {editingId && (
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                    >
                        Cancel
                    </button>
                )}

            </form>

            <h2>My Transactions</h2>

            {/* TRANSACTION LIST */}

            {transactions.length === 0 ? (

                <p>No transactions yet.</p>

            ) : filteredTransactions.length === 0 ? (

                <p>No matching transactions found.</p>

            ) : (

                filteredTransactions.map(
                    (transaction) => (

                        <div
                            key={transaction._id}
                            className="transaction-item"
                        >

                            {/* Category */}
                            <span>
                                {transaction.category}
                            </span>

                            {/* Amount */}
                            <span>
                                ₹{transaction.amount}
                            </span>

                            {/* Type */}
                            <span>
                                {transaction.type}
                            </span>

                            {/* Description */}
                            <span>
                                {transaction.description}
                            </span>

                            {/* Date */}
                            <span>
                                {transaction.date
                                    ? new Date(
                                        transaction.date
                                    ).toLocaleDateString(
                                        "en-IN"
                                    )
                                    : "-"}
                            </span>

                            {/* Edit */}
                            <button
                                type="button"
                                onClick={() =>
                                    handleEdit(transaction)
                                }
                            >
                                Edit
                            </button>

                            {/* Delete */}
                            <button
                                type="button"
                                onClick={() =>
                                    handleDelete(
                                        transaction._id
                                    )
                                }
                            >
                                Delete
                            </button>

                        </div>
                    )
                )
            )}

        </div>
    )
}

export default Transactions