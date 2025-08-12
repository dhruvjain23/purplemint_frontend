import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Simulation() {
    const [drivers, setDrivers] = useState(5);
    const [startTime, setStartTime] = useState("09:00");
    const [maxHours, setMaxHours] = useState(8);
    const [result, setResult] = useState(null);

    const handleRunSimulation = (e) => {
        e.preventDefault();
        // Dummy result - replace with API call
        setResult({
            profit: 25000,
            efficiency: 85,
            onTime: 80,
            late: 20,
        });
    };

    return (
        <div className="flex flex-col w-full">
            <Navbar />
            <div className="flex flex-1 w-full ">
                <Sidebar />

                <div className="p-4 w-full flex-1">
                    <h2 className="text-xl font-bold mb-4">Run Delivery Simulation</h2>
                    <form onSubmit={handleRunSimulation} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="number"
                            value={drivers}
                            onChange={(e) => setDrivers(e.target.value)}
                            className="border p-2 rounded"
                            placeholder="Number of Drivers"
                        />
                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border p-2 rounded" />
                        <input
                            type="number"
                            value={maxHours}
                            onChange={(e) => setMaxHours(e.target.value)}
                            className="border p-2 rounded"
                            placeholder="Max Hours/Day"
                        />
                        <button className="bg-green-600 text-white py-2 rounded col-span-1 md:col-span-3">Run Simulation</button>
                    </form>

                    {result && (
                        <div className="mt-6 bg-white p-4 shadow rounded">
                            <h3 className="font-bold mb-2">Results</h3>
                            <p>Profit: ₹{result.profit}</p>
                            <p>Efficiency: {result.efficiency}%</p>
                            <p>On Time Deliveries: {result.onTime}</p>
                            <p>Late Deliveries: {result.late}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
