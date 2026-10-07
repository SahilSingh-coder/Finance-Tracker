const mongoose = require("mongoose")
const transactionsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: ["income", "expense"],
            required: true
        },
        category: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
)

const Transactions = mongoose.model(
    "Transactions",
    transactionsSchema
)

module.exports = Transactions