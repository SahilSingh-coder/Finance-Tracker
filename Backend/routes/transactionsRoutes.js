const express = require("express")
const Transaction = require("../models/Transactions")
const protect = require("../middleware/authMiddleware")

const router = express.Router()

// CREATE transaction
router.post("/", protect, async (req, res) => {
    try {
        const {
            amount,
            type,
            category,
            description,
            date
        } = req.body

        if (!amount || !type || !category) {
            return res.status(400).json({
                message: "Amount, type and category are required"
            })
        }

        const transaction = await Transaction.create({
            userId: req.userId,
            amount,
            type,
            category,
            description,
            date
        })

        res.status(201).json(transaction)

    } catch (error) {
        console.error("CREATE TRANSACTION ERROR:", error)

        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
})


// GET all transactions
router.get("/", protect, async (req, res) => {
    try {
        const transactions = await Transaction.find({
            userId: req.userId
        }).sort({ date: -1 })

        res.status(200).json(transactions)

    } catch (error) {
        console.error("GET TRANSACTIONS ERROR:", error)

        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
})


// UPDATE transaction
router.put("/:id", protect, async (req, res) => {
    try {
        const {
            amount,
            type,
            category,
            description
        } = req.body

        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.userId
        })

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            })
        }

        transaction.amount = amount
        transaction.type = type
        transaction.category = category
        transaction.description = description

        const updatedTransaction =
            await transaction.save()

        res.status(200).json(updatedTransaction)

    } catch (error) {
        console.error("UPDATE TRANSACTION ERROR:", error)

        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
})


// DELETE transaction
router.delete("/:id", protect, async (req, res) => {
    try {
        const transaction =
            await Transaction.findOneAndDelete({
                _id: req.params.id,
                userId: req.userId
            })

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            })
        }

        res.status(200).json({
            message: "Transaction deleted successfully"
        })

    } catch (error) {
        console.error("DELETE TRANSACTION ERROR:", error)

        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
})

module.exports = router