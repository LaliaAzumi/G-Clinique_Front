import { useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { medecins } from "../data/mockData";
import Pagination from "../components/Pagination";
import "./ListePage.css";

const ITEMS_PER_PAGE = 10;

const specialites = [
  "Toutes",
  "Cardiologue",
  "Généraliste",
  "Pédiatre",
  "Dermatologue",
  "Gynécologue",
] as const;

export default function ListeMedecins() {
  const [search, setSearch] = useState("");
  const [specialiteFilter, setSpecialiteFilter] = useState<
    (typeof specialites)[number]
  >("Toutes");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = medecins.filter((m) => {
    const matchSearch =
      m.nom.toLowerCase().includes(search.toLowerCase()) ||
      m.specialite.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchSpec = specialiteFilter === "Toutes" || m.specialite === specialiteFilter;
    return matchSearch && matchSpec;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Liste des médecins</h1>
          <p className="breadcrumb">Tableau de bord › Médecins</p>
        </div>
        <button className="btn-primary" type="button">
          <Plus size={16} />
          Ajouter un médecin
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
            <label className="filter-label">Spécialité :</label>
            <select
              className="filter-select"
              value={specialiteFilter}
              onChange={(e) => {
                setSpecialiteFilter(e.target.value as (typeof specialites)[number]);
                setCurrentPage(1);
              }}
            >
              {specialites.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Spécialité</th>
              <th>Téléphone</th>
              <th>E-mail</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((m) => (
              <tr key={m.id}>
                <td>
                  <strong>{m.id}</strong>
                </td>
                <td>
                  <strong>{m.nom}</strong>
                </td>
                <td>
                  <strong>{m.specialite}</strong>
                </td>
                <td>{m.telephone}</td>
                <td className="text-muted">{m.email}</td>
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
