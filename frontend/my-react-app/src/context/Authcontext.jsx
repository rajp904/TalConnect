import axios from "axios";
import httpStatus from "http-status";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export const AuthContext = createContext({});

const client = api;

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (formData) => {
        try {
            const request = await client.post("/api/user/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true, 
            });

            if (request.status === httpStatus.CREATED) {
                setUserData(request.data.user);
                navigate("/");
                return request.data.message;
            } else {
                throw new Error("Unexpected status code: " + request.status);
            }
        } catch (err) {
            console.error("Register error:", JSON.stringify(err, null, 2));
            throw err;
        }
    };

    const handleLogin = async (email, password) => {
        try {
            const request = await client.post("/api/user/login", {
                email,
                password,
            }, {
                withCredentials: true, 
            });

            if (request.status === httpStatus.OK) {
                setUserData(request.data.user);
                navigate("/");
            } else {
                throw new Error("Unexpected status code: " + request.status);
            }
        } catch (err) {
            console.error("Login error:", JSON.stringify(err, null, 2));
            throw err;
        }
    };

    const logout = async () => {
        try {
            await client.post("/api/user/logout", {}, {
                withCredentials: true, 
            });
            setUserData(null);
            navigate("/");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

   
    useEffect(() => {
        const fetchUserSession = async () => {
            try {
                const response = await client.get("/api/user/me", {
                    withCredentials: true, 
                });

                if (response.status === 200 && response.data.user) {
                    setUserData(response.data.user);
                } else {
                    setUserData(null);
                }
            } catch (error) {
                setUserData(null);
                console.error("Session fetch error:", error);
            }
        };

        fetchUserSession();
    }, []);

    return (
        <AuthContext.Provider value={{ userData, setUserData, handleRegister, handleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};