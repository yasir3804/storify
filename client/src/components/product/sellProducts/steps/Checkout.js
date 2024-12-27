import React,{useState} from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
} from "@mui/material";
import axios from "axios"; // Assuming you will use axios for API requests

function Checkout({ cart, customer }) {
  const [orderDetails, setOrderDetails] = useState(null); // State to share data
  // Calculate the total price with proper type conversion for price
  const totalPrice = cart.reduce((total, product) => {
    const price = parseFloat(product.price); // Ensure price is a number
    return total + (isNaN(price) ? 0 : price * product.quantity);
  }, 0);

  const handleCheckout = async () => {
    try {
      const checkoutData = {
        customer,
        cart,
        totalPrice,
      };

      const response = await axios.post(
        "http://localhost:8080/api/customer/",
        checkoutData
      );

      if (response.status === 201) {
        alert("Checkout successful!");
        // You can redirect or show a success message here
        setOrderDetails(response.data);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("There was an error during checkout.");
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: 600 }}
      >
        Checkout
      </Typography>

      {/* Customer Info */}
      <Card sx={{ marginBottom: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 500, marginBottom: 2 }}>
            Customer Information
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Name:</strong> {customer.name}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Email:</strong> {customer.email}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Phone:</strong> {customer.phone}
          </Typography>
          <Typography variant="body1">
            <strong>Address:</strong> {customer.address}
          </Typography>
        </CardContent>
      </Card>

      {/* Cart Details */}
      <Card sx={{ marginBottom: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 500, marginBottom: 2 }}>
            Products in Cart
          </Typography>
          {cart.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No products in cart.
            </Typography>
          ) : (
            cart.map((product, index) => {
              const price = parseFloat(product.price);
              return (
                <Grid
                  container
                  key={index}
                  spacing={2}
                  sx={{ marginBottom: 2 }}
                >
                  <Grid item xs={8}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {product.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "right" }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      ${isNaN(price) ? "N/A" : price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total:{" "}
                      {isNaN(price)
                        ? "N/A"
                        : (price * product.quantity).toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Total Price */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Total Price:
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "primary.main" }}
              >
                ${totalPrice.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Checkout Button */}
      <Box sx={{ textAlign: "center", marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ fontWeight: 600, padding: "10px 20px" }}
          onClick={handleCheckout}
        >
          Complete Checkout
        </Button>
      </Box>
    </Box>
  );
}

export default Checkout;
