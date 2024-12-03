import React, { useState } from "react";
import {
    Box,
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    IconButton,
    InputAdornment,
    Alert,
    Card,
    CardContent
} from "@mui/material";
import { styled } from "@mui/system";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 400,
    margin: "100px auto",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    borderRadius: "12px"
}));

const StyledButton = styled(Button)({
    marginTop: "20px",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold"
});

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (prop) => (event) => {
        setCredentials({ ...credentials, [prop]: event.target.value });
        setError("");
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!credentials.email || !credentials.password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const response = await axios.post("https://be-android-project.onrender.com/api/auth/login", {
                email: credentials.email,
                password: credentials.password
            });

            const { user_role } = response.data.user;

            if (user_role === "Admin") {
                localStorage.setItem("token", response.data.token);
                console.log(response.data);
                navigate("/dashboard");
            } else {
                setError("You need to be an admin to access this page");
            }
        } catch (error) {
            console.log(error);
            setError("Invalid email or password");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <StyledCard>
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: "primary.main",
                                borderRadius: "50%",
                                padding: "16px",
                                marginBottom: "16px"
                            }}
                        >
                            <FaLock size={32} color="white" />
                        </Box>

                        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                            Admin Login
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={credentials.email}
                                onChange={handleChange("email")}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FaUser />
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                autoComplete="current-password"
                                value={credentials.password}
                                onChange={handleChange("password")}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <StyledButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                Sign In
                            </StyledButton>
                        </form>
                    </Box>
                </CardContent>
            </StyledCard>
        </Container>
    );
};

export default AdminLogin;