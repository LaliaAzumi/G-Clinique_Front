import { useState, useEffect } from "react";
import { UserPlus, Search, MoreVertical, Edit, Trash2, Stethoscope } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiChambre } from "@/services/apiChambre"; // service API centralisé
import { toast } from "sonner"; // Pour les notifications (déjà dans ton package.json)
//import { chambreService } from "@/lib/api-chambres";
import { Chambre } from "@/types/chambre";
import loginBg from "@/assets/login-bg.jpg";
import AddchambreForm from "@/components/AddChambreForm";

const chambresPage = () => {
  const [chambres, setchambres] = useState<Chambre[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  //recup token
  // Récupère ton vrai token ici (ex: via localStorage)
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
  const loadData = async () => {
    try {
      const response: any = await apiChambre.getAll(token);
      console.log("Données reçues du Backend:", response);

      // On vérifie si la structure contient .data.chambres
      if (response && response.data && Array.isArray(response.data.chambres)) {
        setchambres(response.data.chambres);
      } else {
        // Au cas où la structure changerait ou serait vide
        setchambres([]);
      }
    } catch (error) {
      console.error("Crash API:", error);
      toast.error("Le serveur ne répond pas");
    }
  };
  loadData();
}, [token]);

  const filteredchambres = chambres.filter(c => 
  c.numero?.toLowerCase().includes(search.toLowerCase())
);
// 2. Ajout réel en base
 const handleAddchambre = async (data: any) => {
  try {
    // 1. Envoi au backend
    await apiChambre.create(data, token);
    toast.success("Chambre ajoutée avec succès !");
    setIsModalOpen(false);

    // 2. Récupération de la nouvelle liste
    const response: any = await apiChambre.getAll(token);
    
    // IMPORTANT : On utilise la même structure que dans le useEffect
    if (response && response.data && Array.isArray(response.data.chambres)) {
      setchambres(response.data.chambres);
    }
  } catch (error) {
    console.error("Erreur ajout:", error);
    toast.error("Erreur lors de l'ajout");
  }
};
 

  return (
    <div className="min-h-screen p-8 text-primary-foreground" 
         style={{ backgroundImage: `url(${loginBg})`, backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      {/* overlay sombre */}
      <div className="absolute inset-0 bg-black opacity-65"></div>
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header avec bouton Ajout */}
        <div className="flex justify-between items-center bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/20">
  <div>
    <h1 className="text-3xl font-bold flex items-center gap-2">
      <Stethoscope className="text-primary" /> Gestion des chambres
    </h1>
    <p className="text-white/60">Liste des chambres enregistrés dans la clinique</p>
  </div>

  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
    <DialogTrigger asChild>
      <button className="login-btn !w-auto px-6 flex items-center gap-2">
        <UserPlus size={18} /> Nouveau chambre
      </button>
    </DialogTrigger>
    
    <DialogContent className="glass-card border-white/20 text-primary-foreground sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
           <UserPlus className="text-primary" /> Enregistrer un chambre
        </DialogTitle>
      </DialogHeader>
      
      <AddchambreForm 
        onSubmit={handleAddchambre} 
        onCancel={() => setIsModalOpen(false)} 
      />
    </DialogContent>
  </Dialog>
</div>

        {/* Barre de Recherche */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un nom..." 
            className="login-input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tableau Glassmorphisme */}
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/10 text-sm uppercase">
              <tr>
                <th className="p-4">n° chambre</th>
                <th className="p-4">etage</th>
                <th className="p-4">prixJ</th>
                <th className="p-4">etat</th>
                <th className="p-4">isSoinsIntensifs</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredchambres.map((chambre) => (
                <tr key={chambre.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium">{chambre.numero} </td>
                  <td className="p-4 text-sm text-white/70"> {chambre.etage}</td>
                  <td className="p-4 text-sm text-white/70">{chambre.prixJ} </td>
                    <td className="p-4 font-medium"> {chambre.etat ?  "Libre" : "Occupée"}</td>
                  <td className="p-4 text-sm">{chambre.isSoinsIntensifs ? "urgence" : "nope"} </td>
                  <td className="p-4 flex justify-center gap-3">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-primary"><Edit size={16}/></button>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-red-400"><Trash2 size={16}/>0324096464</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredchambres.length === 0 && (
            <div className="p-10 text-center text-white/40">Aucun chambre trouvé.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default chambresPage;