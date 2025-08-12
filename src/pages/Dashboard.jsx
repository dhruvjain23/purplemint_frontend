import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChartCard from "../components/ChartCard";

export default function Dashboard() {
    const deliveriesData = [
        { name: "On Time", value: 80 },
        { name: "Late", value: 20 },
    ];

    const fuelData = [
        { name: "Base Cost", value: 500 },
        { name: "Traffic Surcharge", value: 200 },
    ];

    return (
        <div className="flex flex-col w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            <Navbar />
            <div className="flex w-full">
                <Sidebar />
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-2/3 overflow-hidden">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                        <h2 className="font-bold">Total Profit</h2>
                        <p className="text-2xl">₹25,000</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                        <h2 className="font-bold">Efficiency Score</h2>
                        <p className="text-2xl">85%</p>
                    </div>
                    <ChartCard title="On-time vs Late Deliveries" data={deliveriesData} />
                    <ChartCard title="Fuel Cost Breakdown" data={fuelData} />
                </div>
            </div>
        </div>
    );
}
