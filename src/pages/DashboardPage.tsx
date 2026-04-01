import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Stethoscope,
  Hospital,
  Calendar,
  TrendingUp,
  Activity,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import StatsCard from "@/components/StatsCard";

const DashboardPage = () => {
  // Données statiques
  const stats = {
    patients: 245,
    clinics: 8,
    services: 32,
    appointments: 156,
  };

  const chartData = [
    { month: "Jan", patients: 45, appointments: 28 },
    { month: "Fév", patients: 52, appointments: 35 },
    { month: "Mar", patients: 68, appointments: 42 },
    { month: "Avr", patients: 75, appointments: 51 },
    { month: "Mai", patients: 82, appointments: 58 },
    { month: "Juin", patients: 88, appointments: 65 },
  ];

  const servicesData = [
    { name: "Consultation", value: 35 },
    { name: "Dentologie", value: 28 },
    { name: "Chirurgie", value: 18 },
    { name: "Radiologie", value: 12 },
    { name: "Autres", value: 7 },
  ];

  return (
    <PageLayout title="Tableau de Bord" subtitle="Vue d'ensemble des statistiques">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Patients"
            value={stats.patients}
            icon={Users}
            change="+5% ce mois"
            trend="up"
            color="primary"
          />
          <StatsCard
            title="Cliniques"
            value={stats.clinics}
            icon={Hospital}
            change="0% ce mois"
            trend="stable"
            color="secondary"
          />
          <StatsCard
            title="Services"
            value={stats.services}
            icon={Stethoscope}
            change="+2% ce mois"
            trend="up"
            color="accent"
          />
          <StatsCard
            title="Rendez-vous"
            value={stats.appointments}
            icon={Calendar}
            change="+12% ce mois"
            trend="up"
            color="primary"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patients & Appointments Trend */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-primary-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="text-primary" size={24} />
              Tendances (6 mois)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#00D9A3"
                  strokeWidth={2}
                  dot={{ fill: "#00D9A3" }}
                  name="Patients"
                />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="#6B9BFF"
                  strokeWidth={2}
                  dot={{ fill: "#6B9BFF" }}
                  name="Rendez-vous"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Services Distribution */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-primary-foreground mb-4 flex items-center gap-2">
              <Activity className="text-primary" size={24} />
              Services Populaires
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={servicesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" fill="#00D9A3" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-6 hover:bg-white/15 transition-all">
            <p className="text-white/70 text-sm mb-2">Taux de remplissage</p>
            <p className="text-2xl font-bold text-primary-foreground">
              {Math.round((stats.appointments / (stats.patients || 1)) * 100)}%
            </p>
          </div>
          <div className="glass-card p-6 hover:bg-white/15 transition-all">
            <p className="text-white/70 text-sm mb-2">Services actifs</p>
            <p className="text-2xl font-bold text-primary-foreground">{stats.services}</p>
          </div>
          <div className="glass-card p-6 hover:bg-white/15 transition-all">
            <p className="text-white/70 text-sm mb-2">Cliniques</p>
            <p className="text-2xl font-bold text-primary-foreground">{stats.clinics}</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;
