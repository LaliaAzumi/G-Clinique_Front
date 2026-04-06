import { useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2, Mail, MapPin } from "lucide-react";
import { patients } from "../data/mockData";
import Pagination from "../components/Pagination";
import AddPatientForm from "../../components/AddPatientForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ITEMS_PER_PAGE = 10;

// Utilitaire pour calculer l'âge à l'affichage
const calculateAge = (birthDate: string) => {
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
};

export default function ListePatients() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = patients.filter((p) => {
    const fullName = `${p.nom} ${p.prenom}`.toLowerCase();
    return fullName.includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
  });

  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dossiers Patients</h1>
          <p className="breadcrumb">Tableau de bord › Patients</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <button className="btn-primary" type="button">
              <Plus size={16} /> Ajouter un patient
            </button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/20 text-white sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Nouveau Patient</DialogTitle>
            </DialogHeader>
            <AddPatientForm 
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
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Identité</th>
              <th>Âge</th>
              <th>Contact</th>
              <th>Adresse & Email</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p) => (
              <tr key={p.id}>
                <td><span className="id-badge">P-{p.id}</span></td>
                <td>
                  <div className="flex flex-col">
                    <span className="font-bold text-white">{p.nom.toUpperCase()}</span>
                    <span className="text-sm text-white/60">{p.prenom}</span>
                  </div>
                </td>
                <td>{calculateAge(p.dateNaissance)} ans</td>
                <td>{p.telephone}</td>
                <td>
                  <div className="flex flex-col gap-1 text-xs text-white/50">
                    <div className="flex items-center gap-1"><MapPin size={12}/> {p.adresse}</div>
                    <div className="flex items-center gap-1"><Mail size={12}/> {p.email}</div>
                  </div>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="action-btn view"><Eye size={15} /></button>
                    <button className="action-btn edit"><Pencil size={15} /></button>
                    <button className="action-btn delete"><Trash2 size={15} /></button>
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