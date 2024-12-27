import React from "react";
import './styles.scss'
function CustomerInfo({ customer, setCustomer }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  return (
    <div>
      <h3>Customer Information</h3>
      <form>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={customer.name || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={customer.email || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={customer.phone || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={customer.address || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={customer.address || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={customer.address || ""}
            onChange={handleInputChange}
          />
        </div>
      </form>
    </div>
  );
}

export default CustomerInfo;
