import React, {useState} from "react";
import {register} from "../../services/auth/authService";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";
import {motion} from "framer-motion";

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("user"); // Default role is 'user'
    const [errors, setErrors] = useState<{
        username?: string;
        password?: string;
        confirmPassword?: string;
        general?: string;
    }>({});
    const navigate = useNavigate();

    const validateForm = () => {
        let formErrors: {
            username?: string;
            password?: string;
            confirmPassword?: string;
        } = {};

        if (!username) {
            formErrors.username = "Username is required";
        }

        if (!password) {
            formErrors.password = "Password is required";
        }

        if (!confirmPassword) {
            formErrors.confirmPassword = "Password confirmation is required";
        } else if (password !== confirmPassword) {
            formErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(formErrors);

        return Object.keys(formErrors).length === 0;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await register({username, password, role});
            navigate("/login"); // Redirect to login page after successful registration
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 400) {
                    setErrors({general: "Registration failed: Invalid credentials"});
                } else {
                    setErrors({general: "Registration failed"});
                }
            } else {
                console.error("Registration error", error);
            }
        }
    };

    return (
        <motion.form
            onSubmit={handleRegister}
            className="max-w-md mx-auto mt-10 p-6 bg-background rounded-lg shadow-neumorphic"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
        >
            <h2 className="text-2xl font-bold mb-4 text-text">Sign Up</h2>
            {errors.general && (
                <div className="mb-4 text-error">{errors.general}</div>
            )}
            <div className="mb-4">
                <label htmlFor="username" className="block mb-2 text-text">
                    Username
                </label>
                <input
                    type="text"
                    value={username}
                    id="username"
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full p-3 rounded-lg shadow-inner bg-backgroundHover focus:outline-none focus:ring-2 focus:ring-primaryLight ${errors.username ? "border-error" : ""
                    }`}
                    required
                />
                {errors.username && (
                    <div className="text-error">{errors.username}</div>
                )}
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block mb-2 text-text">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full p-3 rounded-lg shadow-inner bg-backgroundHover focus:outline-none focus:ring-2 focus:ring-primaryLight ${errors.password ? "border-error" : ""
                    }`}
                    required
                />
                {errors.password && (
                    <div className="text-error">{errors.password}</div>
                )}
            </div>
            <div className="mb-4">
                <label htmlFor="confirmPassword" className="block mb-2 text-text">
                    Confirm Password
                </label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full p-3 rounded-lg shadow-inner bg-backgroundHover focus:outline-none focus:ring-2 focus:ring-primaryLight ${errors.confirmPassword ? "border-error" : ""
                    }`}
                    required
                />
                {errors.confirmPassword && (
                    <div className="text-error">{errors.confirmPassword}</div>
                )}
            </div>
            <motion.button
                type="submit"
                className="w-full p-3 text-white rounded-lg bg-primary shadow-neumorphic hover:bg-primaryDark focus:outline-none transition-transform transform hover:scale-105"
                whileTap={{scale: 0.95}}
            >
                Sign Up
            </motion.button>
        </motion.form>
    );
};

export default RegisterPage;
