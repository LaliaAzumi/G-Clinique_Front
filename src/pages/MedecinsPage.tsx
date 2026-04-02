import { useState, useEffect } from "react";
import { UserPlus, Search, ShieldCheck, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { medecinService } from "@/lib/api-medecins"; // Changé de secretaryService à medecinService
import { Medecin } from "@/types/medecins";
import AddMedecinForm from "@/components/AddMedecinForm";
import loginBg from "@/assets/login-bg.jpg";

const MedecinsPage = () => {
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const fetchMedecins = async () => {
    const data = await medecinService.getAll();
    setMedecins(data);
  };

  useEffect(() => {
    fetchMedecins();
  }, []);

  const handleAddMedecin = async (data: Omit<Medecin, "id">) => {
    try {
      await medecinService.create(data);
      toast.success("Médecin enregistré avec succès");
      setIsModalOpen(false);
      fetchMedecins();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer ce médecin ?")) {
      await medecinService.delete(id);
      toast.info("Médecin supprimé");
      fetchMedecins();
    }
  };

  // Filtrage mis à jour selon l'interface Medecin (Nom et Specialite)
  const filteredMedecins = medecins.filter(m => 
    m.Nom.toLowerCase().includes(search.toLowerCase()) ||
    m.Specialite.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 text-primary-foreground" 
         style={{ backgroundImage: `url(${loginBg})`, backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/20">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShieldCheck className="text-primary" /> Gestion des médecins
            </h1>
            <p className="text-white/60 text-sm">Liste et ajout de nouveaux médecins</p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <button className="login-btn !w-auto px-6 flex items-center gap-2">
                <UserPlus size={18} /> Nouveau médecin
              </button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/20 text-primary-foreground sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Ajouter un profil médecin</DialogTitle>
              </DialogHeader>
              <AddMedecinForm 
                onSubmit={handleAddMedecin} 
                onCancel={() => setIsModalOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou spécialité..." 
            className="login-input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="glass-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/10 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Nom</th>
                <th className="p-4">Spécialité</th>
                <th className="p-4">Téléphone</th>
                <th className="p-4">Adresse</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredMedecins.map((m) => (
                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium">{m.Nom.toUpperCase()}</td>
                  <td className="p-4 text-sm">
                    <span className="bg-primary/20 text-primary-foreground px-2 py-1 rounded border border-primary/30">
                      {m.Specialite}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-white/70">{m.Telephone}</td>
                  <td className="p-4 text-sm text-white/70">{m.Adress}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-primary transition-colors">
                      <Edit size={16}/>
                    </button>
                    <button 
                      onClick={() => handleDelete(m.id)}
                      className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredMedecins.length === 0 && (
            <div className="p-12 text-center text-white/30 italic">Aucun médecin trouvé.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedecinsPage;