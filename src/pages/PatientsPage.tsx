// import { useState, useEffect } from "react";
// import { UserPlus, Search, MoreVertical, Edit, Trash2, Stethoscope } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { toast } from "sonner"; // Pour les notifications (déjà dans ton package.json)
// import { patientService } from "@/lib/api-patients";
// import { Patient } from "@/types/patient";
// import loginBg from "@/assets/login-bg.jpg";
// import AddPatientForm from "@/components/AddPatientForm";

// const PatientsPage = () => {
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [search, setSearch] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Récupération dynamique des données (Prêt pour le Backend)
//   useEffect(() => {
//     patientService.getAll().then(setPatients);
//   }, []);

//   // Filtrage simple pour la démo
//   const filteredPatients = patients.filter(p => 
//     p.lastName.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleAddPatient = async (data: any) => {
//     try {
//       // Appel au service (prêt pour le Backend)
//       await patientService.create(data);
      
//       toast.success("Patient ajouté avec succès !");
//       setIsModalOpen(false);
//       // Optionnel : rafraîchir la liste
//       const updated = await patientService.getAll();
//       setPatients(updated);
//     } catch (error) {
//       toast.error("Erreur lors de l'ajout");
//     }
//   };

//   return (
//     <div className="min-h-screen p-8 text-primary-foreground" 
//          style={{ backgroundImage: `url(${loginBg})`, backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      
//       <div className="max-w-6xl mx-auto space-y-6">
//         {/* Header avec bouton Ajout */}
//         <div className="flex justify-between items-center bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/20">
//   <div>
//     <h1 className="text-3xl font-bold flex items-center gap-2">
//       <Stethoscope className="text-primary" /> Gestion des Patients
//     </h1>
//     <p className="text-white/60">Liste des patients enregistrés dans la clinique</p>
//   </div>

//   <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//     <DialogTrigger asChild>
//       <button className="login-btn !w-auto px-6 flex items-center gap-2">
//         <UserPlus size={18} /> Nouveau Patient
//       </button>
//     </DialogTrigger>
    
//     <DialogContent className="glass-card border-white/20 text-primary-foreground sm:max-w-[500px]">
//       <DialogHeader>
//         <DialogTitle className="text-2xl font-bold flex items-center gap-2">
//            <UserPlus className="text-primary" /> Enregistrer un Patient
//         </DialogTitle>
//       </DialogHeader>
      
//       <AddPatientForm 
//         onSubmit={handleAddPatient} 
//         onCancel={() => setIsModalOpen(false)} 
//       />
//     </DialogContent>
//   </Dialog>
// </div>

//         {/* Barre de Recherche */}
//         <div className="relative max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
//           <input 
//             type="text" 
//             placeholder="Rechercher un nom..." 
//             className="login-input pl-10"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         {/* Tableau Glassmorphisme */}
//         <div className="glass-card overflow-hidden">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-white/10 text-sm uppercase">
//               <tr>
//                 <th className="p-4">Patient</th>
//                 <th className="p-4">Contact</th>
//                 <th className="p-4">Dernière Visite</th>
//                 <th className="p-4 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/10">
//               {filteredPatients.map((patient) => (
//                 <tr key={patient.id} className="hover:bg-white/5 transition-colors">
//                   <td className="p-4 font-medium">{patient.lastName} {patient.firstName}</td>
//                   <td className="p-4 text-sm text-white/70">{patient.email} <br/> {patient.phone}</td>
//                   <td className="p-4 text-sm">{patient.lastVisit}</td>
//                   <td className="p-4 flex justify-center gap-3">
//                     <button className="p-2 hover:bg-white/10 rounded-lg text-primary"><Edit size={16}/></button>
//                     <button className="p-2 hover:bg-white/10 rounded-lg text-red-400"><Trash2 size={16}/></button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {filteredPatients.length === 0 && (
//             <div className="p-10 text-center text-white/40">Aucun patient trouvé.</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientsPage;
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
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

useEffect(() => {
  patientService.getAll().then((data) => {
    console.log("Données reçues de l'API:", data); // <--- AJOUTEZ CECI
    setPatients(data.content || data);
  });
}, []);

const refreshList = async () => {
    try {
      const data = await patientService.getAll();
      setPatients(Array.isArray(data) ? data : data.content || []);
    } catch (e) {
      toast.error("Erreur de chargement");
    }
  };

  // Suppression
  const handleDelete = async (id: number) => {
  if (window.confirm("Voulez-vous vraiment supprimer ce patient ?")) {
    try {
      await patientService.delete(id);
      toast.success("Patient supprimé avec succès");
      
      // Rafraîchir l'état local pour faire disparaître la ligne
      const updatedData = await patientService.getAll();
      setPatients(updatedData.content || updatedData);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  }
};

  // Ajout ou Modification
  const handleAddOrUpdate = async (data: any) => {
    try {
      if (selectedPatient) {
        await patientService.update(data);
        toast.success("Patient mis à jour");
      } else {
        await patientService.create(data);
        toast.success("Patient ajouté");
      }
      setIsModalOpen(false);
      setSelectedPatient(null);
      refreshList();
    } catch (error) {
      toast.error("Erreur lors de l'opération");
    }
  };
  // Filtrage simple pour la démo
  // Filtrage sur le champ 'nom' retourné par l'API
const filteredPatients = patients.filter(p => 
  p.nom && p.nom.toLowerCase().includes(search.toLowerCase())
);

  // PatientsPage.tsx
// PatientsPage.tsx
const handleAddPatient = async (payload: any) => {
  try {
    if (selectedPatient) {
      // On s'assure que l'ID est bien présent pour la mise à jour
      const updatePayload = { ...payload, id: selectedPatient.id };
      await patientService.update(updatePayload);
      toast.success("Patient mis à jour !");
    } else {
      await patientService.create(payload);
      toast.success("Patient ajouté !");
    }
    
    setIsModalOpen(false);
    setSelectedPatient(null);
    refreshList(); // Recharge le tableau
  } catch (error: any) {
    toast.error("Erreur : " + error.message);
  }
};



  return (
    <div className="min-h-screen p-8 text-primary-foreground" 
         style={{ backgroundImage: `url(${loginBg})`, backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      {/* overlay sombre */}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      
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
      <button 
        onClick={() => { setSelectedPatient(null); setIsModalOpen(true); }} 
        className="login-btn..."
      >
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
        onCancel={() => { setIsModalOpen(false); setSelectedPatient(null); }} 
        initialData={selectedPatient} // On passe les données ici !
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
                <th className="p-4">NOM</th>
                <th className="p-4">PRENOM</th>
                <th className="p-4">DATE NAISSANCE</th>
                <th className="p-4 ">TELEPHONE</th>
                <th className="p-4 ">ADRESSE</th>
                <th className="p-4 ">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">{patient.nom}</td>
                  <td className="p-4">{patient.prenom}</td>
                  <td className="p-4">{patient.dateNaissance}</td>
                  <td className="p-4">{patient.telephone}</td>
                  <td className="p-4">{patient.adresse}</td>
                  <td className="p-4 flex gap-3">
                    <button 
                      onClick={() => { setSelectedPatient(patient); setIsModalOpen(true); }}
                      className="p-2 hover:bg-white/10 rounded-lg text-primary"
                    >
                      <Edit size={16}/>
                    </button>
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