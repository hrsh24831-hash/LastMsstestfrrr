import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [isLoaded, setIsLoaded] = useState(false);

  const loadAttendance = async (date) => {
    setIsLoaded(false);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/attendance?date=${selectedDate}`);
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to load records");
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadAttendance(selectedDate);
  }, [selectedDate]);

  // Color mapping for meal badges
  const getMealStyle = (meal) => {
    const types = {
      Breakfast: { bg: "#fff7ed", color: "#c2410c" },
      Lunch: { bg: "#f0fdf4", color: "#15803d" },
      Dinner: { bg: "#eff6ff", color: "#1d4ed8" }
    };
    return types[meal] || { bg: "#f1f5f9", color: "#475569" };
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#ffffff",
      backgroundImage: "radial-gradient(#e2e8f0 0.5px, transparent 0.5px)",
      backgroundSize: "24px 24px",
      padding: "40px 20px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      color: "#1e293b"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-row { animation: fadeIn 0.4s ease forwards; }
        @media (max-width: 768px) {
          .hide-mobile { display: none; }
          .table-container { background: transparent !important; box-shadow: none !important; border: none !important; }
          .desktop-table { display: block; }
          .desktop-table thead { display: none; }
          .desktop-table tr { 
            display: flex; flex-direction: column; 
            background: white; margin-bottom: 16px; 
            padding: 20px; border-radius: 20px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
            border: 1px solid #f1f5f9;
          }
          .desktop-table td { padding: 4px 0 !important; border: none !important; }
          .mobile-label { font-weight: 700; font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; margin-right: 8px; }
        }
      `}</style>

      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Top Bar */}
        <div style={{ 
          display: "flex", flexWrap: "wrap", justifyContent: "space-between", 
          alignItems: "center", marginBottom: "40px", gap: "20px" 
        }}>
          <div>
            <h2 style={{ fontSize: "2rem", fontWeight: "800", margin: 0, letterSpacing: "-0.02em" }}>
              Attendance Log
            </h2>
            <p style={{ color: "#64748b", marginTop: "4px" }}>Manage and track daily meal records</p>
          </div>

          <div style={{ 
            display: "flex", alignItems: "center", background: "#fff", 
            padding: "8px 16px", borderRadius: "16px", border: "1px solid #e2e8f0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
          }}>
            <span style={{ marginRight: "12px", fontWeight: "600", fontSize: "0.9rem" }}>Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ border: "none", outline: "none", fontSize: "1rem", fontWeight: "600", color: "#3b82f6", cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Records Count Card */}
        <div style={{ 
          background: "linear-gradient(90deg, #3b82f6, #6366f1)", 
          padding: "20px 30px", borderRadius: "24px", color: "#fff",
          marginBottom: "30px", display: "inline-block"
        }}>
          <span style={{ opacity: 0.8, fontSize: "0.9rem" }}>Total Attendees:</span>
          <span style={{ fontSize: "1.5rem", fontWeight: "800", marginLeft: "10px" }}>{records.length}</span>
        </div>

        {/* Main Table Content */}
        <div className="table-container" style={{ 
          background: "#ffffff", borderRadius: "24px", border: "1px solid #f1f5f9",
          boxShadow: "0 10px 25px rgba(0,0,0,0.03)", overflow: "hidden"
        }}>
          <table className="desktop-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                <th style={{ padding: "20px", textAlign: "left", fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>TIMESTAMP</th>
                <th style={{ padding: "20px", textAlign: "left", fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>STUDENT / USER</th>
                <th className="hide-mobile" style={{ padding: "20px", textAlign: "left", fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>CONTACT</th>
                <th style={{ padding: "20px", textAlign: "left", fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>MEAL TYPE</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => {
                const mealStyle = getMealStyle(r.mealType);
                return (
                  <tr key={r._id} className="animate-row" style={{ 
                    borderBottom: "1px solid #f8fafc", 
                    transition: "background 0.2s"
                  }}>
                    <td style={{ padding: "20px", color: "#1e293b", fontWeight: "500" }}>
                      <span className="mobile-label">Time:</span>
                      {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: "20px" }}>
                      <span className="mobile-label">User:</span>
                      <div style={{ fontWeight: "700", color: "#0f172a" }}>{r.userId?.name || "Unknown"}</div>
                      <div className="hide-mobile" style={{ fontSize: "0.8rem", color: "#94a3b8" }}>UID: {r._id.slice(-6).toUpperCase()}</div>
                    </td>
                    <td className="hide-mobile" style={{ padding: "20px", color: "#64748b" }}>
                      {r.userId?.phone}
                    </td>
                    <td style={{ padding: "20px" }}>
                      <span className="mobile-label">Meal:</span>
                      <span style={{ 
                        padding: "6px 14px", borderRadius: "10px", 
                        fontSize: "0.8rem", fontWeight: "700",
                        backgroundColor: mealStyle.bg, color: mealStyle.color
                      }}>
                        {r.mealType}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {records.length === 0 && isLoaded && (
            <div style={{ padding: "60px", textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🏜️</div>
              <p>No records found for this date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}