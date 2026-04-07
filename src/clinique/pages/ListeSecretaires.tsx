import { useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { secretaires } from "../data/mockData";
import Pagination from "../components/Pagination";
// Import du formulaire spécifique et des composants de dialogue
import AddSecretaryForm from "../../components/AddSecretaryForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import "./ListePage.css";

const ITEMS_PER_PAGE = 10;

export default function ListeSecretaires() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleAddSuccess = () => {
    setIsModalOpen(false);
    // Logique de rafraîchissement des données ici
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Liste des secrétaires</h1>
          <p className="breadcrumb">Tableau de bord › Secrétaires</p>
        </div>

        {/* Modale d'ajout de secrétaire */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <button className="btn-primary" type="button">
              <Plus size={16} />
              Ajouter un secrétaire
            </button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/20 text-white sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Nouveau compte secrétaire</DialogTitle>
            </DialogHeader>
            
            <AddSecretaryForm 
              onSubmit={handleAddSuccess} 
              onCancel={() => setIsModalOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-input">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par identifiant ou email..."
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
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((s) => (
              <tr key={s.id}>
                <td><span className="id-badge">{s.id}</span></td>
                <td>
                  <strong>{s.username}</strong>
                </td>
                <td className="text-muted">{s.email}</td>
                <td>
                  <div className="actions-cell">
                    <button className="action-btn view" title="Voir profil">
                      <Eye size={15} />
                    </button>
                    <button className="action-btn edit" title="Modifier">
                      <Pencil size={15} />
                    </button>
                    <button className="action-btn delete" title="Supprimer">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length > 0 ? (
          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        ) : (
          <div className="p-12 text-center text-white/30 italic">
            Aucun membre administratif trouvé pour cette recherche.
          </div>
        )}
      </div>
    </div>
  );
}