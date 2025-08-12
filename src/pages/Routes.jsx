import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [formData, setFormData] = useState({ route_id: "", distance_km: "", traffic_level: "", base_time_min: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No auth token found");
        return;
      }
      const res = await fetch("https://purple-mint-assessment-xyo1.vercel.app/api/route/getAllRoute", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setRoutes(data);
    } catch (err) {
      console.error("Error fetching routes:", err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!['High', 'Medium', 'Low'].includes(formData.traffic_level)) {
      alert("Traffic level must be High, Medium, or Low");
      return;
    }
    const body = {
      route_id: Number(formData.route_id),
      distance_km: Number(formData.distance_km),
      traffic_level: formData.traffic_level,
      base_time_min: Number(formData.base_time_min),
    };
    const url = editingId ? `/api/route/${editingId}` : "/api/route/addroutes";
    const method = editingId ? "PUT" : "POST";
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No auth token found");
        return;
      }
      const res = await fetch(`https://purple-mint-assessment-xyo1.vercel.app${url}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      await fetchRoutes();
      setFormData({ route_id: "", distance_km: "", traffic_level: "", base_time_min: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Error submitting route:", err.message);
    }
  };

  const handleEdit = (route) => {
    setFormData({
      route_id: route.route_id,
      distance_km: route.distance_km,
      traffic_level: route.traffic_level,
      base_time_min: route.base_time_min,
    });
    setEditingId(route._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No auth token found");
        return;
      }
      const res = await fetch(`https://purple-mint-assessment-xyo1.vercel.app/api/route/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      await fetchRoutes();
    } catch (err) {
      console.error("Error deleting route:", err.message);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <div className="p-4 w-2/3 overflow-hidden">
          <h1 className="text-2xl font-bold mb-4">Manage Routes</h1>
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4 flex flex-col gap-4">
            <input
              type="number"
              placeholder="Route ID"
              value={formData.route_id}
              onChange={(e) => setFormData({ ...formData, route_id: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Distance (km)"
              value={formData.distance_km}
              onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <select
              value={formData.traffic_level}
              onChange={(e) => setFormData({ ...formData, traffic_level: e.target.value })}
              className="border p-2 rounded"
              required
            >
              <option value="" disabled>Select Traffic Level</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <input
              type="number"
              placeholder="Base Time (min)"
              value={formData.base_time_min}
              onChange={(e) => setFormData({ ...formData, base_time_min: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              {editingId ? "Update Route" : "Add Route"}
            </button>
          </form>
          <div className="bg-white p-4 rounded shadow overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Route ID</th>
                  <th className="p-2 text-left">Distance (km)</th>
                  <th className="p-2 text-left">Traffic Level</th>
                  <th className="p-2 text-left">Base Time (min)</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route._id} className="border-b">
                    <td className="p-2">{route.route_id}</td>
                    <td className="p-2">{route.distance_km}</td>
                    <td className="p-2">{route.traffic_level}</td>
                    <td className="p-2">{route.base_time_min}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(route)}
                        className="bg-yellow-500 text-white p-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(route._id)}
                        className="bg-red-500 text-white p-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}