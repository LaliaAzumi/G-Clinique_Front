import { useState, useEffect } from "react";
import { UserPlus, Search, MoreVertical, Edit, Trash2, Stethoscope } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner"; // Pour les notifications (déjà dans ton package.json)
import { patientService } from "@/lib/api-patients";
import { Patient } from "@/types/patient";
import loginBg from "@/assets/login-bg.jpg";
import AddPatientForm from "@/components/AddPatientForm";

const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Récupération dynamique des données (Prêt pour le Backend)
  useEffect(() => {
    patientService.getAll().then(setPatients);
  }, []);

  // Filtrage simple pour la démo
  const filteredPatients = patients.filter(p => 
    p.lastName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddPatient = async (data: any) => {
    try {
      // Appel au service (prêt pour le Backend)
      await patientService.create(data);
      
      toast.success("Patient ajouté avec succès !");
      setIsModalOpen(false);
      // Optionnel : rafraîchir la liste
      const updated = await patientService.getAll();
      setPatients(updated);
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
    }
  };
const handleDelete = async (id: string) => {
  if (window.confirm("Supprimer ce patient ?")) {
    try {
      await patientService.delete(id);
      setPatients(patients.filter(p => p.id !== id));
      toast.success("Patient supprimé");
    } catch (error) {
      toast.error("Erreur de suppression");
    }
  }
};
  return (
    <div className="min-h-screen p-8 text-primary-foreground" 
         style={{ backgroundImage: `url(${loginBg})`, backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header avec bouton Ajout */}
        <div className="flex justify-between items-center bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/20">
  <div>
    <h1 className="text-3xl font-bold flex items-center gap-2">
      <Stethoscope className="text-primary" /> Gestion des Patients
    </h1>
    <p className="text-white/60">Liste des patients enregistrés dans la clinique</p>
  </div>

  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
    <DialogTrigger asChild>
      <button className="login-btn !w-auto px-6 flex items-center gap-2">
        <UserPlus size={18} /> Nouveau Patient
      </button>
    </DialogTrigger>
    
    <DialogContent className="glass-card border-white/20 text-primary-foreground sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
           <UserPlus className="text-primary" /> Enregistrer un Patient
        </DialogTitle>
      </DialogHeader>
      
      <AddPatientForm 
        onSubmit={handleAddPatient} 
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
                <th className="p-4">Patient</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Dernière Visite</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium">{patient.lastName} {patient.firstName}</td>
                  <td className="p-4 text-sm text-white/70">{patient.email} <br/> {patient.phone}</td>
                  <td className="p-4 text-sm">{patient.lastVisit}</td>
                  <td className="p-4 flex justify-center gap-3">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-primary"><Edit size={16}/></button>
                    <button 
                      onClick={() => handleDelete(patient.id)} 
                      className="p-2 hover:bg-white/10 rounded-lg text-red-400"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPatients.length === 0 && (
            <div className="p-10 text-center text-white/40">Aucun patient trouvé.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientsPage;