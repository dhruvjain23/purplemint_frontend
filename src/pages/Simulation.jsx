import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Simulation() {
    const [drivers, setDrivers] = useState(5);
    const [startTime, setStartTime] = useState("09:00");
    const [maxHours, setMaxHours] = useState(8);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRunSimulation = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const payload = {
                num_drivers: Number(drivers),
                start_time: startTime,
                max_hours: Number(maxHours),
            };

            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token not found. Please log in.");
            }

            const res = await fetch(
                "https://purple-mint-assessment-xyo1.vercel.app/api/simulation/runSimulation",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to run simulation");
            }

            const data = await res.json();
            setResult({
                profit: data.results.total_profit,
                efficiency: data.results.efficiency_score,
                onTime: data.results.on_time,
                late: data.results.late,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white min-h-screen">
            <Navbar />
            <div className="flex flex-1 w-full">
                <Sidebar />
                <div className="p-4 w-full flex-1">
                    <h2 className="text-xl font-bold mb-4">Run Delivery Simulation</h2>
                    <form
                        onSubmit={handleRunSimulation}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <input
                            type="number"
                            value={drivers}
                            onChange={(e) => setDrivers(e.target.value)}
                            className="border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="Number of Drivers"
                        />
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <input
                            type="number"
                            value={maxHours}
                            onChange={(e) => setMaxHours(e.target.value)}
                            className="border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="Max Hours/Day"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white py-2 rounded col-span-1 md:col-span-3"
                        >
                            {loading ? "Running..." : "Run Simulation"}
                        </button>
                    </form>

                    {error && <p className="text-red-500 mt-4">{error}</p>}

                    {result && (
                        <div className="mt-6 bg-white dark:bg-gray-800 p-4 shadow rounded border border-gray-200 dark:border-gray-700">
                            <h3 className="font-bold mb-2">Results</h3>
                            <p>Profit: ₹{Math.round(result.profit)}</p>
                            <p>Efficiency: {result.efficiency.toFixed(2)}%</p>
                            <p>On Time Deliveries: {result.onTime}</p>
                            <p>Late Deliveries: {result.late}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
