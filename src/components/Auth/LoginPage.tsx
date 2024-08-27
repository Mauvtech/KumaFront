import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/authContext";
import {login as loginService} from "../../services/auth/authService";
import {AxiosError} from "axios";
import {motion} from "framer-motion";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{
        username?: string;
        password?: string;
        general?: string;
    }>({});
    const navigate = useNavigate();
    const {login} = useAuth();

    const validateForm = () => {
        let formErrors: {
            username?: string;
            password?: string
        } = {};

        if (!username) {
            formErrors.username = "Username is required";
        }

        if (!password) {
            formErrors.password = "Password is required";
        }

        setErrors(formErrors);

        return Object.keys(formErrors).length === 0;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const userData = await loginService({username, password});
            if (userData) {
                login(userData);
                navigate("/");
            } else {
                setErrors({general: "Login failed"});
                console.error("Login failed");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 400) {
                    setErrors({general: "Invalid credentials"});
                } else {
                    setErrors({general: "Login failed"});
                }
            } else {
                console.error("Login error", error);
            }
        }
    };

    return (
        <motion.form
            onSubmit={handleLogin}
            className="max-w-md mx-auto mt-10 p-6 bg-background rounded-lg shadow-neumorphic"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
        >
            <h2 className="text-2xl font-bold mb-4 text-text">Login</h2>
            {errors.general && (
                <div className="mb-4 text-error">{errors.general}</div>
            )}
            <div className="mb-4">
                <label htmlFor="username" className="block mb-2 text-text">
                    Username
                </label>
                <input
                    id="username"
                    placeholder="Username"
                    type="text"
                    value={username}
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
                    id="password"
                    placeholder="Password"
                    type="password"
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
            <motion.button
                type="submit"
                className="w-full p-3 text-white rounded-lg bg-primary shadow-neumorphic hover:bg-primaryDark focus:outline-none transition-transform transform hover:scale-105"
                whileTap={{scale: 0.95}}
            >
                Login
            </motion.button>
        </motion.form>
    );
};

export default LoginPage;
