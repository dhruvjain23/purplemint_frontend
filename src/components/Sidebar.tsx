import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="bg-gray-100 w-64 p-4 space-y-4 min-h-screen">
            <Link to="/dashboard" className="block p-2 hover:bg-gray-200 rounded">
                Dashboard
            </Link>
            <Link to="/simulation" className="block p-2 hover:bg-gray-200 rounded">
                Simulation
            </Link>
            {/* <Link to="/drivers" className="block p-2 hover:bg-gray-200 rounded">Drivers</Link>
      <Link to="/routes" className="block p-2 hover:bg-gray-200 rounded">Routes</Link>
      <Link to="/orders" className="block p-2 hover:bg-gray-200 rounded">Orders</Link> */}
        </div>
    );
}
