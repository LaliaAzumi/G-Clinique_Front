import "./ListePage.css";

export default function Dashboard() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="breadcrumb">Tableau de bord</p>
        </div>
      </div>
      <div
        className="table-card"
        style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}
      >
        <p>Bienvenue sur le tableau de bord de la Clinique.</p>
      </div>
    </div>
  );
}
