import { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("https://purple-mint-assessment-xyo1.vercel.app/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);
            window.location.href = "/dashboard";
        } catch (err) {
            setError(err.message || "An error occurred during login");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-green-100 w-full">
            <form className="bg-amber-900 p-6 rounded shadow w-96" onSubmit={handleLogin}>
                <h2 className="text-xl font-bold mb-4">Manager Login</h2>

                {/* Light mode message */}
                <p className="text-yellow-200 mb-2 text-sm">
                    ⚠️ Please open in light mode for better view
                </p>

                {/* Default credentials */}
                <p className="text-green-200 mb-4 text-sm">
                    <strong>Username:</strong> admin<br />
                    <strong>Password:</strong> password
                </p>

                {error && <p className="text-red-500 mb-3">{error}</p>}

                <input
                    type="text"
                    placeholder="Username"
                    className="w-full border p-2 mb-3 rounded"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-3 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                />
                <button
                    className="bg-green-600 text-white w-full py-2 rounded disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
