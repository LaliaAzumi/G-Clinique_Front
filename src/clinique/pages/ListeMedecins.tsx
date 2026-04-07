import { useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2, ShieldCheck } from "lucide-react";
import { medecins } from "../data/mockData"; // Assure-toi que mockData utilise aussi les minuscules
import Pagination from "../components/Pagination";
import AddMedecinForm from "../../components/AddMedecinForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import "./ListePage.css";

const ITEMS_PER_PAGE = 10;

export default function ListeMedecins() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = medecins.filter((m) => {
    return (
      m.nom.toLowerCase().includes(search.toLowerCase()) ||
      m.specialite.toLowerCase().includes(search.toLowerCase()) ||
      m.telephone.includes(search)
    );
  });

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ShieldCheck className="text-primary" /> Liste des médecins
          </h1>
          <p className="breadcrumb">Tableau de bord › Médecins</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <button className="btn-primary" type="button">
              <Plus size={16} /> Ajouter un médecin
            </button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/20 text-white sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Nouveau Profil Médecin</DialogTitle>
            </DialogHeader>
            <AddMedecinForm 
              onSubmit={() => setIsModalOpen(false)} 
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
              placeholder="Rechercher par nom, spécialité..."
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
              <th>Nom du Médecin</th>
              <th>Spécialité</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((m) => (
              <tr key={m.id}>
                <td><span className="id-badge">#{m.id}</span></td>
                <td><strong>{m.nom.toUpperCase()}</strong></td>
                <td>
                  <span className="specialite-tag">{m.specialite}</span>
                </td>
                <td>{m.telephone}</td>
                <td className="text-muted">{m.adresse}</td>
                <td>
                  <div className="actions-cell">
                    <button className="action-btn view" title="Voir détails"><Eye size={15} /></button>
                    <button className="action-btn edit" title="Modifier"><Pencil size={15} /></button>
                    <button className="action-btn delete" title="Supprimer"><Trash2 size={15} /></button>
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