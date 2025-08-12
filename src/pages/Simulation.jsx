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
                start_time: startTime, // keep HH:MM format
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
        <div className="flex flex-col w-full">
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
                            className="border p-2 rounded"
                            placeholder="Number of Drivers"
                        />
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="border p-2 rounded"
                        />
                        <input
                            type="number"
                            value={maxHours}
                            onChange={(e) => setMaxHours(e.target.value)}
                            className="border p-2 rounded"
                            placeholder="Max Hours/Day"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 text-white py-2 rounded col-span-1 md:col-span-3"
                        >
                            {loading ? "Running..." : "Run Simulation"}
                        </button>
                    </form>

                    {error && <p className="text-red-500 mt-4">{error}</p>}

                    {result && (
                        <div className="mt-6 bg-white p-4 shadow rounded">
                            <h3 className="font-bold mb-2">Results</h3>
                            <p>Profit: ₹{result.profit}</p>
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
