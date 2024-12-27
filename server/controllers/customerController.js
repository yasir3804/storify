const Customer = require("../models/customerModel");
const Product = require("../models/productModel"); // Assuming Product model exists
const mongoose = require("mongoose");
const moment = require("moment");
const Order = require("../models/orderModel");
// const createCustomerOrder = async (req, res) => {
//   try {
//     console.log(req.user._id);
//     const { customer, cart } = req.body;

//     // Prepare customer object
//     const customerData = {
//       user_id: req.user._id, // Ensure user_id is included
//       name: customer.name,
//       email: customer.email,
//       address: customer.address,
//     };

//     // Map cart items to customer_products
//     const customerProducts = cart.map((item) => ({
//       product_id: item._id, // Ensure product_id maps correctly
//       quantity: item.quantity,
//       price: item.price,
//     }));

//     // Check if customer exists
//     const existingCustomer = await Customer.findOne({
//       $or: [{ email: customer.email }, { phone: customer.phone }],
//       user_id: req.user._id,
//     });

//     if (existingCustomer) {
//       return res.status(400).json({
//         error: "Customer already exists with this email or phone number.",
//       });
//     }

//     let totalOrderPrice = 0;
//     console.log(customerProducts);
//     // Update product quantities and calculate total price
//     for (let product of customerProducts) {
//       const productInStock = await Product.findById(product.product_id);

//       if (!productInStock) {
//         return res.status(404).json({
//           error: `Product with ID ${product.product_id} not found.`,
//         });
//       }

//       if (productInStock.quantity < product.quantity) {
//         return res.status(400).json({
//           error: `Not enough stock for product: ${productInStock.name}.`,
//         });
//       }

//       productInStock.quantity -= product.quantity;
//       await productInStock.save();

//       totalOrderPrice += product.price * product.quantity;
//     }

//     // Save customer order
//     // // Create the customer order
//     const newCustomerOrder = await Customer.create({
//       ...customerData,
//       customer_products: customerProducts,
//       customer_order_total: totalOrderPrice,
//     });

//     await newCustomerOrder.save();

//     res.status(201).json({
//       success: true,
//       message: "Customer order created successfully.",
//       data: newCustomerOrder,
//     });
//   } catch (error) {
//     console.error("Error creating customer order:", error);
//     res.status(500).json({
//       error: "An error occurred while creating the customer order.",
//     });
//   }
// };

//Invoice api
const createCustomerOrder = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID comes from authentication middleware
    const { customer, cart } = req.body;

    // Prepare customer data
    const customerData = {
      user_id: userId,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    };

    // Map cart items to customer_products
    const customerProducts = cart.map((item) => ({
      product_id: item._id,
      quantity: item.quantity,
      price: item.price,
    }));

    // Check if the customer already exists
    let customerRecord = await Customer.findOne({
      $or: [{ email: customer.email }, { phone: customer.phone }],
      user_id: userId,
    });

    if (!customerRecord) {
      // Create a new customer if none exists
      customerRecord = new Customer(customerData);
      await customerRecord.save();
    }

    let totalOrderPrice = 0;

    // Validate and update product stock
    for (let product of customerProducts) {
      const productInStock = await Product.findById(product.product_id);

      if (!productInStock) {
        return res.status(404).json({
          error: `Product with ID ${product.product_id} not found.`,
        });
      }

      if (productInStock.quantity < product.quantity) {
        return res.status(400).json({
          error: `Not enough stock for product: ${productInStock.name}.`,
        });
      }

      productInStock.quantity -= product.quantity;
      await productInStock.save();

      totalOrderPrice += product.price * product.quantity;
    }

    // Create a new order for the customer
    const newOrder = new Order({
      user_id: userId,
      customer_id: customerRecord._id,
      customer_products: customerProducts,
      customer_order_total: totalOrderPrice,
      customer_order_status: "pending", // Default status
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Customer order created successfully.",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating customer order:", error);
    res.status(500).json({
      error: "An error occurred while creating the customer order.",
    });
  }
};
const generateInvoice = async (req, res) => {
  try {
    const { customer_id } = req.params; // Customer ID from URL parameters
    const { date } = req.query; // Date from query parameters (optional)

    // Build the match condition dynamically
    const matchCondition = { _id: new mongoose.Types.ObjectId(customer_id) };

    // If a date is provided, add the date range filter
    if (date) {
      const startOfDay = moment(date, "YYYY-MM-DD").startOf("day").toDate();
      const endOfDay = moment(date, "YYYY-MM-DD").endOf("day").toDate();
      matchCondition.customer_order_date = { $gte: startOfDay, $lte: endOfDay };
    }

    // Aggregate to get the customer order with product details
    const invoiceData = await Customer.aggregate([
      { $match: matchCondition }, // Match the customer and optionally filter by date
      { $unwind: "$customer_products" }, // Deconstruct the customer_products array
      {
        $lookup: {
          from: "products", // Join with the 'products' collection
          localField: "customer_products.product_id", // Match customer_products.product_id with the product _id
          foreignField: "_id", // Match it to the _id of the product
          as: "product_details", // Output the matched products in a new field "product_details"
        },
      },
      { $unwind: "$product_details" }, // Unwind the product details (flatten the result)
      {
        $project: {
          customer_name: 1,
          customer_email: 1,
          customer_phone: 1,
          customer_address: 1,
          "product_details.name": 1, // Include product name
          "product_details.price": 1, // Include product price
          "customer_products.quantity": 1, // Include product quantity
          customer_order_total: 1, // Include the total order amount
          customer_order_date: 1, // Include the order date
        },
      },
    ]);

    if (!invoiceData.length) {
      return res.status(404).json({
        error: "Customer order not found.",
      });
    }

    // Generate the invoice details
    const invoice = {
      customer_name: invoiceData[0].customer_name,
      customer_email: invoiceData[0].customer_email,
      customer_phone: invoiceData[0].customer_phone,
      customer_address: invoiceData[0].customer_address,
      products: invoiceData.map((item) => ({
        product_name: item.product_details.name,
        quantity: item.customer_products.quantity,
        price: item.product_details.price,
        total: item.customer_products.quantity * item.product_details.price,
      })),
      order_total: invoiceData[0].customer_order_total,
      order_date: invoiceData[0].customer_order_date,
    };

    // Send the invoice as a response
    res.status(200).json({
      success: true,
      message: "Invoice generated successfully.",
      invoice,
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({
      error: "An error occurred while generating the invoice.",
    });
  }
};

const getCustomersByUserId = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the user_id is passed as a URL parameter

    // Find customers associated with the provided user_id
    const customers = await Customer.find({ user_id: id });

    // Return the customers
    res.status(200).json({
      success: true,
      message: "Customers retrieved successfully.",
      data: customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      error: "An error occurred while fetching customers.",
    });
  }
};

module.exports = { createCustomerOrder, getCustomersByUserId, generateInvoice };
