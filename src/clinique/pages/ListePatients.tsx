import { useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2, User } from "lucide-react";
import { patients } from "../data/mockData";
import Pagination from "../components/Pagination";
import "./ListePage.css";

const ITEMS_PER_PAGE = 10;

export default function ListePatients() {
  const [search, setSearch] = useState("");
  const [sexeFilter, setSexeFilter] = useState("Tous");
  const [statutFilter, setStatutFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = patients.filter((p) => {
    const matchSearch =
      p.nomComplet.toLowerCase().includes(search.toLowerCase()) ||
      p.telephone.includes(search);
    const matchSexe = sexeFilter === "Tous" || p.sexe === sexeFilter;
    return matchSearch && matchSexe;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Liste des patients</h1>
          <p className="breadcrumb">Tableau de bord › Patients</p>
        </div>
        <button className="btn-primary" type="button">
          <Plus size={16} />
          Ajouter un patient
        </button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-input">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Sexe:</label>
            <select
              className="filter-select"
              value={sexeFilter}
              onChange={(e) => {
                setSexeFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option>Tous</option>
              <option>Homme</option>
              <option>Femme</option>
            </select>
          </div>
          <div className="filter-group">
            <select
              className="filter-select"
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
            >
              <option>Tous</option>
            </select>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID Patient</th>
              <th>Nom complet</th>
              <th>Sexe</th>
              <th>Âge</th>
              <th>Téléphone</th>
              <th>Dernière consultation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <span className="patient-name">
                    <strong>{p.nom}</strong> {p.prenom}
                  </span>
                </td>
                <td>
                  <div className="sexe-cell">
                    <div
                      className={`sexe-icon sexe-${p.sexe === "Homme" ? "homme" : "femme"}`}
                    >
                      <User size={13} />
                    </div>
                    {p.sexe}
                  </div>
                </td>
                <td>{p.age}</td>
                <td>{p.telephone}</td>
                <td>{p.derniereConsultation}</td>
                <td>
                  <div className="actions-cell">
                    <button className="action-btn view" type="button">
                      <Eye size={15} />
                    </button>
                    <button className="action-btn edit" type="button">
                      <Pencil size={15} />
                    </button>
                    <button className="action-btn delete" type="button">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
