const mongoose = require("mongoose");
// const customerSchema = mongoose.Schema(
//   {
//     user_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       match: [
//         /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//         "Please provide a valid email address",
//       ],
//     },
//     phone: {
//       type: String,
//       required: false,
//       unique: true,
//       match: [/^\d{10}$/, "Please provide a valid phone number"],
//     },
//     address: {
//       type: String,
//       required: true,
//     },
//     customer_products: [
//       {
//         product_id: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//           min: 1,
//         },
//         price: {
//           type: Number,
//           required: true,
//           min: 0,
//         },
//       },
//     ],
//     customer_order_status: {
//       type: String,
//       default: "pending",
//       enum: ["pending", "completed", "canceled"],
//     },
//     customer_order_date: {
//       type: Date,
//       default: Date.now,
//     },
//     customer_order_total: {
//       type: Number,
//       min: 0,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

const CustomerSchema = new mongoose.Schema({
      user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
