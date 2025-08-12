import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Simulation from "./pages/Simulation";
import Drivers from "./pages/driver";
import Orders from "./pages/Order";
import RoutesPage from "./pages/Routes";
// import Dashboard from "./pages/Dashboard";
// import Simulation from "./pages/Simulation";
// import Drivers from "./pages/Drivers";
// import RoutesPage from "./pages/Routes";
// import Orders from "./pages/Orders";

function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/" />;
}

export default function App() {
    return (
        <BrowserRouter>
            <div className="w-full">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/simulation"
                        element={
                            <PrivateRoute>
                                <Simulation />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/drivers"
                        element={
                            <PrivateRoute>
                                <Drivers />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/orders"
                        element={
                            <PrivateRoute>
                                <Orders />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/routes"
                        element={
                            <PrivateRoute>
                                <RoutesPage />
                            </PrivateRoute>
                        }
                    />
                    
                </Routes>
            </div>
        </BrowserRouter>
    );
}
