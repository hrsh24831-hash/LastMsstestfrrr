import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AddUser from "./pages/AddUser";
import Scanner from "./pages/Scanner";
import Users from "./pages/Users";
import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <>
      <nav
        style={{
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          padding: 12,
          display: "flex",
          gap: 16,
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/add-user">Add User</Link>
        <Link to="/scanner">Scanner</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/attendance">Attendance</Link>
      </nav>
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/add-user" element={<AddUser />} />
  <Route path="/scanner" element={<Scanner />} />
  <Route path="/admin/users" element={<Users />} />
  <Route path="/admin/dashboard" element={<Dashboard />} />  {/* 🔥 THIS LINE */}
  <Route path="/attendance" element={<Attendance />} />
</Routes>

    </>
  );
}
