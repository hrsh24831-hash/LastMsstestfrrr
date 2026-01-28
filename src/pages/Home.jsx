import React, { useState } from 'react';

export default function Home() {
  const menuItems = [
    { title: "Add User", path: "/add-user", desc: "Enroll new members", iconPath: "M12 4v16m8-8H4", color: "#3b82f6" },
    { title: "Scanner", path: "/scanner", desc: "Scan QR Codes", iconPath: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z", color: "#8b5cf6" },
    { title: "Dashboard", path: "/admin/dashboard", desc: "System Metrics", iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z", color: "#10b981" },
    { title: "Users List", path: "/admin/users", desc: "Management", iconPath: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", color: "#f59e0b" },
    { title: "Attendance", path: "/attendance", desc: "Log History", iconPath: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", color: "#ef4444" },
  ];

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#ffffff",
      backgroundImage: "linear-gradient(to bottom right, #f8fafc, #eff6ff)",
      padding: "80px 24px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      color: "#1e293b"
    }}>
      {/* Dynamic Keyframes for the Entrance */}
      <style>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: scale(0.9) translateY(30px); filter: blur(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        .reveal { animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      <div className="reveal" style={{ textAlign: "center", marginBottom: "80px" }}>
        <h1 style={{ 
          fontSize: "clamp(2.5rem, 8vw, 4rem)", 
          fontWeight: "800", 
          letterSpacing: "-0.04em",
          margin: 0,
          background: "linear-gradient(90deg, #1e293b, #3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Management System
        </h1>
        <p style={{ color: "#64748b", fontSize: "1.2rem", fontWeight: "500", marginTop: "16px" }}>
          Simple. Fluid. Powerful.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "32px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}>
        {menuItems.map((item, i) => (
          <InteractiveCard key={i} item={item} delay={i * 0.1} />
        ))}
      </div>
    </div>
  );
}

function InteractiveCard({ item, delay }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={item.path}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: 0,
        animation: `slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s forwards`,
        textDecoration: "none",
        background: isHovered ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px)",
        padding: "40px 32px",
        borderRadius: "32px",
        border: "1px solid",
        borderColor: isHovered ? item.color : "rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        transition: "all 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
        transform: isHovered ? "translateY(-12px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: isHovered 
          ? `0 30px 60px -12px rgba(0, 0, 0, 0.1), 0 18px 36px -18px ${item.color}44` 
          : "0 10px 30px -10px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{
        backgroundColor: isHovered ? item.color : "#f1f5f9",
        width: "64px",
        height: "64px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "24px",
        transition: "all 0.5s ease",
        transform: isHovered ? "rotate(12deg)" : "rotate(0deg)",
      }}>
        <svg 
          width="28" height="28" viewBox="0 0 24 24" fill="none" 
          stroke={isHovered ? "#fff" : "#64748b"} 
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transition: "all 0.5s ease" }}
        >
          <path d={item.iconPath} />
        </svg>
      </div>

      <h3 style={{ 
        color: "#0f172a", 
        fontSize: "1.5rem", 
        fontWeight: "700", 
        margin: "0 0 8px 0",
        transition: "color 0.3s ease"
      }}>
        {item.title}
      </h3>
      <p style={{ 
        color: "#64748b", 
        fontSize: "1rem", 
        lineHeight: "1.5", 
        margin: 0 
      }}>
        {item.desc}
      </p>

      <div style={{
        marginTop: "24px",
        fontSize: "0.8rem",
        fontWeight: "700",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: item.color,
        opacity: isHovered ? 1 : 0,
        transform: isHovered ? "translateX(0)" : "translateX(-10px)",
        transition: "all 0.3s ease"
      }}>
        Explore →
      </div>
    </a>
  );
}