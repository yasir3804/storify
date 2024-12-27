// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getProducts, selectIsLoading, selectProducts } from "../../../redux/features/product/productSlice";
// import './sellProducts.scss'
// const Sell = () => {
//   const dispatch = useDispatch();
//   const isLoading = useSelector(selectIsLoading);
//   const products = useSelector((state) => state.product.products);

//   useEffect(() => {
//     dispatch(getProducts());
//   }, [dispatch]);

//   if (isLoading) return <div>Loading...</div>;

//   return (
//     <div>
//       <h1>Products for Sale</h1>
//       {products.length > 0 ? (
//         <ul>
//           {products.map((product) => (
//             <li key={product._id}>{product.name}</li>
//           ))}
//         </ul>
//       ) : (
//         <p>No products available</p>
//       )}
//     </div>
//   );
// };

// export default Sell;
import React, { useState } from "react";
import { Stepper, Step, StepLabel, Button, Box } from "@mui/material";
import ProductSelection from "./steps/ProducSelection";
import CustomerInfo from "./steps/CustomerInfo";
import Checkout from "./steps/Checkout";
import Invoice from "./steps/Invoice";

const steps = ["Select Products", "Customer Info", "Checkout", "Print Invoice"];

function Sell() {
  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({});

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);
  const handleReset = () => {
    setActiveStep(0);
    setCart([]);
    setCustomer({});
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return <ProductSelection cart={cart} setCart={setCart} />;
      case 1:
        return <CustomerInfo customer={customer} setCustomer={setCustomer} />;
      case 2:
        return <Checkout cart={cart} customer={customer} />;
      case 3:
        return <Invoice cart={cart} customer={customer} />;
      default:
        return "Unknown step";
    }
  };

  return (
    <Box sx={{ width: "70%", margin: "auto", mt: 5 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 5 }}>
        {activeStep === steps.length ? (
          <Box>
            <Button onClick={handleReset} variant="contained">
              Reset
            </Button>
          </Box>
        ) : (
          <Box>
            {getStepContent()}
            <Box sx={{ mt: 2 }}>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext} variant="contained" sx={{ ml: 2 }}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Sell;
