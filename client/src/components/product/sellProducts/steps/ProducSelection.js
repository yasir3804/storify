import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  selectIsLoading,
  selectProducts,
} from "../../../../redux/features/product/productSlice";

function ProductSelection({ cart, setCart }) {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const products = useSelector((state) => state.product.products);

  // State for storing quantity of each product
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;

  // Function to update the quantity for a specific product
  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  // Function to add the selected product to the cart
  const addToCart = (product) => {
    const quantity = quantities[product._id] || 1; // Default to 1 if no quantity selected
    const newCart = [...cart];
    const existingProductIndex = newCart.findIndex(
      (item) => item._id === product._id
    );

    if (existingProductIndex !== -1) {
      // Update the quantity if the product already exists in the cart
      newCart[existingProductIndex].quantity += quantity;
    } else {
      // Add a new product to the cart
      newCart.push({ ...product, quantity });
    }

    setCart(newCart); // Update the cart state
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Select Products</h3>
      <div style={styles.formContainer}>
        {products.map((product) => (
          <div key={product._id} style={styles.productItem}>
            <div style={styles.productDetails}>
              <p>
                {product.name} - ${product.price}
              </p>
              <div style={styles.quantityContainer}>
                <input
                  type="number"
                  min="1"
                  value={quantities[product._id] || 1} // This will maintain state per product
                  onChange={(e) =>
                    handleQuantityChange(product._id, parseInt(e.target.value, 10))
                  }
                  style={styles.input}
                />
                <button
                  onClick={() => addToCart(product)}
                  style={styles.addButton}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary (optional) */}
      <div style={styles.cartSummary}>
        <h4>Cart Summary</h4>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item._id} style={styles.cartItem}>
                {item.name} - Quantity: {item.quantity} - $
                {item.price * item.quantity}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Styles for a professional UI
const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  productItem: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '700px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  productDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'flex-start',
  },
  quantityContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '60px',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  cartSummary: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  cartItem: {
    marginBottom: '10px',
  },
};

export default ProductSelection;
