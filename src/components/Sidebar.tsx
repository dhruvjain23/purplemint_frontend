import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="bg-gray-100 dark:bg-gray-800 w-64 p-4 space-y-4 min-h-screen">
            <Link 
                to="/dashboard" 
                className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-800 dark:text-gray-200"
            >
                Dashboard
            </Link>
            <Link 
                to="/simulation" 
                className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-800 dark:text-gray-200"
            >
                Simulation
            </Link>
            <Link 
                to="/drivers" 
                className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-800 dark:text-gray-200"
            >
                Drivers
            </Link>
            <Link 
                to="/orders" 
                className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-800 dark:text-gray-200"
            >
                Orders
            </Link>
            <Link 
                to="/routes" 
                className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-800 dark:text-gray-200"
            >
                Routes
            </Link>
        </div>
    );
}
