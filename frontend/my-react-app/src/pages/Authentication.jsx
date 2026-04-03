import React from "react";
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/Authcontext";

function Authentication() {
    const [tab, setTab] = useState(0);
    const [role, setRole] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);

    const { handleRegister, handleLogin } = useContext(AuthContext);

    const showSnackbar = (message) => {
        alert(message);
    };

    const handleAuth = async () => {
        try {
            if (tab === 0) {
                await handleLogin(email, password);
                showSnackbar("Login successful!");
            } else {
                if (!role || !name || !username || !email || !password) {
                    showSnackbar("Please fill all fields");
                    return;
                }

                const formData = new FormData();
                formData.append("name", name);
                formData.append("username", username);
                formData.append("email", email);
                formData.append("password", password);
                formData.append("role", role);

                if (profilePhoto) {
                    formData.append("profilePhoto", profilePhoto);
                }

                const msg = await handleRegister(formData);
                showSnackbar(msg || "Registration successful!");
            }
        } catch (error) {
            console.error(error);
            showSnackbar("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 relative overflow-hidden">

            {/* glow effects */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full"></div>

            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-white">

                <h2 className="text-3xl font-bold text-center mb-6">
                    {tab === 0 ? "Login" : "Signup"}
                </h2>

                {/* Tabs */}
                <div className="flex mb-6 rounded-lg overflow-hidden border border-white/20">
                    <button
                        className={`w-1/2 py-2 font-semibold transition ${
                            tab === 0
                                ? "bg-blue-500 text-white"
                                : "bg-white/10 text-gray-300"
                        }`}
                        onClick={() => setTab(0)}
                    >
                        Login
                    </button>
                    <button
                        className={`w-1/2 py-2 font-semibold transition ${
                            tab === 1
                                ? "bg-blue-500 text-white"
                                : "bg-white/10 text-gray-300"
                        }`}
                        onClick={() => setTab(1)}
                    >
                        Signup
                    </button>
                </div>

                {/* Login */}
                {tab === 0 ? (
                    <div className="space-y-4">

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
                        />

                        <button
                            onClick={handleAuth}
                            className="w-full bg-blue-500 hover:bg-blue-600 transition py-3 rounded-lg font-semibold shadow-lg"
                        >
                            Login
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">

                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 p-3 rounded-lg placeholder-gray-300"
                        />

                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 p-3 rounded-lg placeholder-gray-300"
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 p-3 rounded-lg placeholder-gray-300"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 p-3 rounded-lg placeholder-gray-300"
                        />

                        {/* Role */}
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 p-3 rounded-lg text-gray-300"
                        >
                            <option value="">Select Role</option>
                            <option value="recruiter">Recruiter</option>
                            <option value="developer">Developer</option>
                        </select>

                        {/* Upload */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfilePhoto(e.target.files[0])}
                            className="w-full text-gray-300"
                        />

                        <button
                            onClick={handleAuth}
                            className="w-full bg-blue-500 hover:bg-blue-600 transition py-3 rounded-lg font-semibold shadow-lg"
                        >
                            Signup
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Authentication;