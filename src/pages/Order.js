import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  CircularProgress,
  Container,
  InputAdornment,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaMoneyBillWave } from "react-icons/fa";
import axios from "axios";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: "2rem",
  borderRadius: "15px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
}));

const StyledForm = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: "1rem",
  fontSize: "1.1rem",
  background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
  boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
  color: "white",
  "&:hover": {
    background: "linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)",
    transform: "translateY(-2px)",
    transition: "all 0.3s ease",
  },
}));

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    orderType: "",
    language: "en",
    bankCode: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const orderTypes = [
    { value: "product", label: "Product Purchase" },
    { value: "service", label: "Service Payment" },
    { value: "subscription", label: "Subscription" },
  ];

  const languages = [
    { value: "en", label: "English" },
    { value: "vi", label: "Vietnamese" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "amount":
        if (!value) {
          newErrors.amount = "Amount is required";
        } else if (isNaN(value) || value <= 0) {
          newErrors.amount = "Please enter a valid amount";
        } else {
          delete newErrors.amount;
        }
        break;
      case "description":
        if (!value) {
          newErrors.description = "Description is required";
        } else {
          delete newErrors.description;
        }
        break;
      case "orderType":
        if (!value) {
          newErrors.orderType = "Order type is required";
        } else {
          delete newErrors.orderType;
        }
        break;
      case "bankCode":
        if (!value) {
          newErrors.bankCode = "Bank code is required";
        } else if (value.length < 3) {
          newErrors.bankCode = "Bank code must be at least 3 characters";
        } else {
          delete newErrors.bankCode;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/order/create_payment_url', {
        amount: formData.amount,
        orderDescription: formData.description,
        orderType: formData.orderType,
        language: formData.language,
        bankCode: formData.bankCode,
      });

      if (response.status === 200 && response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error creating payment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <StyledPaper elevation={3}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", mb: 4, fontWeight: "bold" }}
        >
          Payment Form
        </Typography>

        <StyledForm onSubmit={handleSubmit} noValidate>
          <TextField
            label="Amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            error={!!errors.amount}
            helperText={errors.amount}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaMoneyBillWave />
                </InputAdornment>
              ),
            }}
            aria-label="Payment amount"
          />

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            required
            fullWidth
            multiline
            rows={3}
            aria-label="Order description"
          />

          <TextField
            select
            label="Order Type"
            name="orderType"
            value={formData.orderType}
            onChange={handleChange}
            error={!!errors.orderType}
            helperText={errors.orderType}
            required
            fullWidth
            aria-label="Select order type"
          >
            {orderTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            fullWidth
            aria-label="Select language"
          >
            {languages.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Bank Code"
            name="bankCode"
            value={formData.bankCode}
            onChange={handleChange}
            error={!!errors.bankCode}
            helperText={errors.bankCode}
            required
            fullWidth
            aria-label="Bank code"
          />

          <StyledButton
            type="submit"
            disabled={loading}
            aria-label="Submit payment"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Thanh toán"
            )}
          </StyledButton>
        </StyledForm>
      </StyledPaper>
    </Container>
  );
};

export default PaymentForm;
