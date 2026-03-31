import { useState, useEffect } from "react";
import { UserPlus, Search, ShieldCheck, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { secretaryService } from "@/lib/api-secretaries";
import { Secretary } from "@/types/secretary";
import AddSecretaryForm from "@/components/AddSecretaryForm";
import loginBg from "@/assets/login-bg.jpg";

const SecretariesPage = () => {
  const [secretaries, setSecretaries] = useState<Secretary[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Chargement initial
  useEffect(() => {
    secretaryService.getAll().then(setSecretaries);
  }, []);

  // Logique d'ajout (Prête pour l'équipe Backend)
  const handleAddSecretary = async (data: Omit<Secretary, "id">) => {
    try {
      await secretaryService.create(data);
      toast.success("Secrétaire enregistrée avec succès");
      setIsModalOpen(false);
      
      // Rafraîchir la liste après ajout
      const updatedList = await secretaryService.getAll();
      setSecretaries(updatedList);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const filteredSecretaries = secretaries.filter(s => 
    s.lastName.toLowerCase().includes(search.toLowerCase()) ||
    s.assignedService.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 text-primary-foreground" 
         style={{ backgroundImage: `url(${loginBg})`, backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/20">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShieldCheck className="text-primary" /> Personnel Administratif
            </h1>
            <p className="text-white/60 text-sm">Gestion des accès et affectations des secrétaires</p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <button className="login-btn !w-auto px-6 flex items-center gap-2">
                <UserPlus size={18} /> Nouvelle Secrétaire
              </button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/20 text-primary-foreground sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Ajouter un profil administratif</DialogTitle>
              </DialogHeader>
              {/* Utilisation correcte du composant avec ses props */}
              <AddSecretaryForm 
                onSubmit={handleAddSecretary} 
                onCancel={() => setIsModalOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou service..." 
            className="login-input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table Section */}
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/10 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Identité</th>
                <th className="p-4">Service</th>
                <th className="p-4">Contact</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredSecretaries.map((s) => (
                <tr key={s.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium">{s.lastName.toUpperCase()} {s.firstName}</td>
                  <td className="p-4 text-sm">
                    <span className="bg-primary/20 text-primary-foreground px-2 py-1 rounded border border-primary/30">
                      {s.assignedService}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-white/70">{s.email}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-primary transition-colors"><Edit size={16}/></button>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSecretaries.length === 0 && (
            <div className="p-12 text-center text-white/30 italic">Aucun membre administratif trouvé.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecretariesPage;