import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import huhu from "@/assets/huhu.svg";


import {
  User,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  DollarSign,
  Pill,
  FileText
} from "lucide-react";

type DashboardData = {
  totalMedecins: number;
  totalPatients: number;
  totalRdv: number;
  rdvEnAttente: number;
  rdvTermine: number;
  totalPaiement: number;
  totalMedicaments: number;
  totalPrestations: number;
  rdvParJour: Array<{ date: string; value: number }>;
};

const emptyDashboard: DashboardData = {
  totalMedecins: 0,
  totalPatients: 0,
  totalRdv: 0,
  rdvEnAttente: 0,
  rdvTermine: 0,
  totalPaiement: 0,
  totalMedicaments: 0,
  totalPrestations: 0,
  rdvParJour: [],
};

const Card = ({ icon: Icon, label, value }: any) => (
  <div
    style={{
      background: "#fff",
      padding: "16px",
      borderRadius: "14px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.06)",
      display: "flex",
      alignItems: "center",
      gap: "14px",
      transition: "0.2s",
    }}
    onMouseEnter={(e) =>
      ((e.currentTarget.style.transform = "translateY(-3px)"),
      (e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.08)"))
    }
    onMouseLeave={(e) =>
      ((e.currentTarget.style.transform = "translateY(0)"),
      (e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.06)"))
    }
  >
    <div
      style={{
        background: "#eff6ff4f",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      <Icon size={22} color="#3b82f6" />
    </div>

    <div>
      <div style={{ fontSize: "13px", color: "#6b7280" }}>{label}</div>
      <div style={{ fontWeight: "bold", fontSize: "20px" }}>{value}</div>
    </div>
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>(emptyDashboard);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/api/v1/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(body?.detail || "Erreur de chargement du dashboard");
        }
        return body;
      })
      .then((res) => setData({ ...emptyDashboard, ...res }))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setRole(parsedUser.role);
    }
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        // background: "#f9fafb1c",
        // minHeight: "100vh",
      }}
    >
      {role === "ADMIN" && (
        <>
          <h2
            style={{
              fontSize: "26px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Dashboard
          </h2>

          {error && (
            <div style={{ color: "#ef4444", marginBottom: "15px" }}>
              {error}
            </div>
          )}

          {/* CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(230px,1fr))",
              gap: "16px",
              marginBottom: "30px",
              color: "#374151",
            }}
          >
            <Card icon={User} label="Médecins" value={data.totalMedecins} />
            <Card icon={Users} label="Patients" value={data.totalPatients} />
            <Card icon={Calendar} label="RDV" value={data.totalRdv} />
            <Card icon={Clock} label="En attente" value={data.rdvEnAttente} />
            <Card icon={CheckCircle} label="Terminés" value={data.rdvTermine} />
            <Card icon={DollarSign} label="Paiements" value={`${data.totalPaiement} Ar`} />
            <Card icon={Pill} label="Médicaments" value={data.totalMedicaments} />
            <Card icon={FileText} label="Prestations" value={data.totalPrestations} />
          </div>

          {/* CHART */}
          <div
            style={{
              background: "#ffffff56",
              padding: "20px",
              borderRadius: "14px",
              boxShadow: "0 6px 15px rgba(46, 46, 46, 0.99)",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>RDV par jour</h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.rdvParJour}>
                <XAxis dataKey="date"/>
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#27d3d3"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {role !== "ADMIN" && (
        <>
       
        
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            fontSize: "28px",
            fontWeight: "bold",
            backgroundImage: `url(${huhu})`,
            width: "100%",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            // color: "#6b7280",
          }}
          >
          <h2
            style={{
              fontSize: "26px",
              fontWeight: "bold",
              marginTop: "520px",
            }}
          >
             BIENVENUE SUR VOTRE ESPACE
          </h2>
         
        </div>
          </>
      )}
    </div>
  );
}
