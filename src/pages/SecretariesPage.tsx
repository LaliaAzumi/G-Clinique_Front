import { useState, useEffect } from "react";
import { UserPlus, Search, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { secretaryService } from "@/lib/api-secretaries";
import { Secretary } from "@/types/secretary";
import AddSecretaryForm from "@/components/AddSecretaryForm";
import loginBg from "@/assets/login-bg.jpg";

const SecretariesPage = () => {
  const [secretaries, setSecretaries] = useState<Secretary[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Chargement initial depuis FastAPI
  useEffect(() => {
    loadSecretaries();
  }, []);

  const loadSecretaries = async () => {
  try {
    const response = await secretaryService.getAll();
    console.log("Structure détectée :", response);

    // On descend dans response.data.users
    if (response && response.success && response.data && Array.isArray(response.data.users)) {
      setSecretaries(response.data.users);
    } else {
      console.error("Structure inattendue :", response);
      setSecretaries([]); 
    }
  } catch (error: any) {
    toast.error("Impossible de charger les secrétaires");
    setSecretaries([]);
  }
};

  const handleAddSecretary = async (data: Omit<Secretary, "id">) => {
    try {
      await secretaryService.create(data);
      toast.success("Secrétaire ajouté avec succès !");
      setIsModalOpen(false);
      loadSecretaries(); // Rafraîchir la liste
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredSecretaries = (Array.isArray(secretaries) ? secretaries : []).filter(s => {
  // On ajoute des "?" au cas où certains champs soient nuls en base de données
  const lastName = s.lastName?.toLowerCase() || "";
  const username = s.username?.toLowerCase() || "";
  const firstName = s.firstName?.toLowerCase() || "";
  const searchLower = search.toLowerCase();
  
  return lastName.includes(searchLower) || firstName.includes(searchLower);
});

  return (
    <div className="min-h-screen p-8 text-primary-foreground" 
         style={{ backgroundImage: `url(${loginBg})`, backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/20">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShieldCheck className="text-primary" /> Gestion des Secrétaires
            </h1>
            <p className="text-white/60">Administration du personnel d'accueil</p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <button className="login-btn !w-auto px-6 flex items-center gap-2">
                <UserPlus size={18} /> Nouveau Compte
              </button>
            </DialogTrigger>
            
            <DialogContent className="glass-card border-white/20 text-primary-foreground sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Inscrire un Secrétaire</DialogTitle>
              </DialogHeader>
              <AddSecretaryForm onSubmit={handleAddSecretary} onCancel={() => setIsModalOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un secrétaire..." 
            className="login-input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="glass-card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/10 text-sm">
              <tr>
                <th className="p-4">Nom / Prénom</th>
                <th className="p-4">Service</th>
                <th className="p-4">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredSecretaries.map((sec) => (
                <tr key={sec.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">{sec.username}</td>
                  <td className="p-4"><span className="bg-primary/20 px-2 py-1 rounded text-xs">{sec.assignedService}</span></td>
                  <td className="p-4 text-sm text-white/70">{sec.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecretariesPage;