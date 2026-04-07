import { useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { secretaires } from "../data/mockData";
import Pagination from "../components/Pagination";
import "./ListePage.css";

const ITEMS_PER_PAGE = 10;

export default function ListeSecretaires() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = secretaires.filter((s) => {
    const matchSearch =
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Liste des secrétaires</h1>
          <p className="breadcrumb">Tableau de bord › Secrétaires</p>
        </div>
        <button className="btn-primary" type="button">
          <Plus size={16} />
          Ajouter un secrétaire
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
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>E-mail</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>
                  <strong>{s.username}</strong>
                </td>
                <td className="text-muted">{s.email}</td>
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
